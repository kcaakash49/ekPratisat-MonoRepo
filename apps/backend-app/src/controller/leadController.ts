import { Prisma, prisma } from "@repo/database";
import { AppError, createLead } from "@repo/functions";
import { UpdateLeadSchema } from "@repo/validators";
import { Request, Response } from "express";

type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "INTERESTED"
  | "LOST"
  | "WON"
  | "NOT_INTERESTED"
  | "FOLLOW_UP"
  | "IN_PROGRESS"
  | "IN_NEGOTIATION";

//addLead controller function to handle lead creation requests, including file uploads and permission checks
export const addLead = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (user?.role !== "admin" && user?.role !== "staff") {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }

    req.body.managedById = user.id;

    const adaptedFile = req.file
      ? {
          fieldname: req.file.fieldname,
          buffer: req.file.buffer,
          mimetype: req.file.mimetype,
          originalname: req.file.originalname,
          size: req.file.size,
        }
      : null;

    const result = await createLead({
      body: req.body,
      file: adaptedFile,
      user
    });

    return res
      .status(200)
      .json({ message: "Lead created successfully", ok: true });
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.status)
        .json({ message: error.message, ok: false });
    }

    return res
      .status(500)
      .json({ message: "Internal Server Error", ok: false });
  }
};

export const getLeads = async (req: Request, res: Response) => {
  try {
    // 1. Extract and sanitize query parameters with defensive fallbacks
    console.log(
      "I am in the getLeads controller with query params:",
      req.query,
    );
    const q = (req.query.q as string)?.trim() || "";
    const statusFilter = (req.query.status as string)?.toUpperCase() || "ALL";
    const dealType = (req.query.dealType as string)?.toLowerCase() || "ALL";
    const clientType = (req.query.clientType as string)?.toUpperCase() || "ALL";

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(
      1,
      Math.min(100, parseInt(req.query.limit as string) || 10),
    ); // Caps max page size to 100 for safety
    const skip = (page - 1) * limit;

    // 2. Build the dynamic database WHERE filter payload
    

    const VALID_LEAD_STATUSES = [
      "NEW",
      "CONTACTED",
      "INTERESTED",
      "NOT_INTERESTED",
      "IN_PROGRESS",
      "IN_NEGOTIATION",
      "FOLLOW_UP",
      "WON",
      "LOST",
    ] as const;

    const validDealTypes = ["buy", "rent", "sell"] as const;
    const validClientType = ["BUYER", "SELLER"] as const;

    const finalDealType = (validDealTypes as readonly string[]).includes(dealType)
      ? dealType
      : undefined;
    const finalClientType = (validClientType as readonly string[]).includes(clientType)
      ? clientType
      : undefined;
    const finalStatus = (VALID_LEAD_STATUSES as readonly string[]).includes(statusFilter) ? statusFilter : undefined;

    const whereClause = {
      ...(q && {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { contact: { contains: q, mode: "insensitive" as const } },
          { email: { contains: q, mode: "insensitive" as const} },
          { source: { contains: q, mode: "insensitive" } as const },
        ],
      }),
      ...(finalDealType && {dealType: finalDealType}),
      ...(finalClientType && {clientType:finalClientType}),
      ...(finalStatus && {status: finalStatus})
    };


    // 3. Execute queries concurrently using a Promise transaction to optimize execution time
    const [leads, totalRecords] = await prisma.$transaction([
      prisma.lead.findMany({
        where: whereClause as any,
        orderBy: { createdAt: "desc" }, // Fresh leads bubble up to the top automatically
        skip: skip,
        take: limit,
        // Include relations if your dashboard card needs to show assignees/properties
        include: {
          managedBy: { select: { name: true, email: true } },
        },
      }),
      prisma.lead.count({ where: whereClause as any}),
    ]);

    // 4. Calculate total pages for UI button handling limits
    const totalPages = Math.ceil(totalRecords / limit);

    // 5. Package and return the standard paginated data shape
    return res.status(200).json({
      success: true,
      data: leads,
      meta: {
        total: totalRecords,
        page,
        pageSize:limit,
        totalPages
      }
    });
  } catch (error: any) {
    console.error("Error inside getLeads controller pipeline:", error);
    return res.status(500).json({
      success: false,
      message:
        "An internal server error occurred while retrieving lead documents.",
      error: error.message,
    });
  }
};


export async function getLeadById(req:Request, res:Response){
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new AppError(400, "Invalid Lead id");
    }

    const result = await prisma.lead.findUnique({
      where: {id},
      include: {
        managedBy: {select : {name:true, email:true}},
        updatedBy: {select: {name:true, email:true}}
      },
    })

    if(!result) {
      return res.status(404).json({
        message: "No lead for the id found!!!"
      })
    }

    return res.status(200).json({
      ok:true,
      result
    })

  } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.status).json({
          message:error.message
        })
      }
      return res.status(500).json({
        message: "Couldn't fetch lead data"
      })
  }
}

export async function updateLeadStatus(req:Request,res:Response){
  try {
    const { id } = req.params;
    const user = req.user;
    const { status, remarks,followUpAt } = req.body;

    if(!id || Array.isArray(id)) {
      throw new AppError(400,"Invalid Lead Id")
    }
    
    const checkExistingStatus = await prisma.lead.findUnique({
      where: {id}
    })

    if (!checkExistingStatus) {
      return res.status(404).json({ message: "Lead record not found." });
    }

    if(checkExistingStatus?.status === "WON" || checkExistingStatus?.status === "LOST") {
      return res.status(400).json({
        message: "Lead is already Closed and locked down."
      })
    }

    if(status === "FOLLOW_UP" && !followUpAt) {
      return res.status(400).json({
        message:"Follow Up status updates require an explicitly set follow-up time. status should have followup time aswell"
      })
    }

    if((status === "WON" || status === "LOST") && !remarks.trim()) {
      return res.status(400).json({
        message:"WON and LOST statuses mean a lead is closed; audit remarks are strictly mandatory!"
      })
    }

   const updateData: any = {
      status: status,
      updatedById: user.id
    };

    // Only touch remarks if provided in request, or if forcing a terminal state
    if (remarks !== undefined || status === "WON" || status === "LOST") {
      updateData.remarks = remarks?.trim() || null;
    }

    // Only update follow-up alarm time if provided, or if moving away from a follow-up stage
    if (followUpAt !== undefined) {
      updateData.followUpAt = followUpAt ? new Date(followUpAt) : null;
    } else if (status === "WON" || status === "LOST" || status === "NEW") {
      // Clean up past stale follow-up alarms automatically when deal reaches its end
      updateData.followUpAt = null;
    }

    // Execute database pipeline patch
    await (prisma.lead.update as any)({
      where: { id },
      data: updateData
    });

    return res.status(200).json({
      ok:true,
      message:"Status Update Succesfully!!!"
    })
  } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.status).json({
          message: error.message
        })
      }

      return res.status(500).json({
        message: "Server couldn't update status, so try again later"
      })
  }
}


export async function updateFollowUpTime(req:Request,res:Response){
  try {
    const user = req.user;
    const {followUpAt} = req.body;
    const {id} = req.params;
    if(!id || Array.isArray(id)) {
      throw new AppError(400,"Invalid Lead Id")
    }

    const checkExistingStatus = await prisma.lead.findUnique({
      where: {id}
    })

    if (!checkExistingStatus) {
      return res.status(404).json({ message: "Lead record not found." });
    }

    if(checkExistingStatus?.status === "WON" || checkExistingStatus?.status === "LOST") {
      return res.status(400).json({
        message: "Lead is already Closed and locked down."
      })
    }

    if(checkExistingStatus.status === "NEW"){
      return res.status(400).json({
        message: "Lead stauts is NEW so change status to update follow-up time!!!"
      })
    }

    await prisma.lead.update({
      where: {id},
      data: {
        followUpAt,
        updatedById:user.id
      }
    })

    return res.status(200).json({
      ok:true,
      message:"Follow-up Time updated succesfully!!!"
    })
    
  } catch (error) {
    return res.status(500).json({
        message: "Server couldn't process your request, so try again later"
      })
  }
}


export async function updateLeadBasicInformation(req:Request, res:Response){
  try {
    console.log("Body", req.body);
    const {id} = req.params;
    const user = req.user;
    const {name,email,coordinates,notes} = req.body;

    const parsedData = UpdateLeadSchema.safeParse(req.body);

    if (!parsedData.success){
      throw new AppError(412,"Input validation failed");
    }

    if(!id || Array.isArray(id)) {
      throw new AppError(400,"Invalid Lead Id")
    }

    const checkExistingStatus = await prisma.lead.findUnique({
      where: {id}
    })

    if (!checkExistingStatus) {
      return res.status(404).json({ message: "Lead record not found." });
    }

    if(checkExistingStatus?.status === "WON" || checkExistingStatus?.status === "LOST") {
      return res.status(400).json({
        message: "Lead is already Closed and locked down."
      })
    }

    const data = parsedData.data;

    console.log("Data in update", data);

    await prisma.lead.update({
      where: {id},
      data: {
        name:data.name ?? null,
        email:data.email ?? null,
        coordinates: data.coordinates ?? null,
        notes: (data.notes && Object.keys(data.notes).length > 0) ? data.notes : null
      }
    })

    return res.status(200).json({
      ok:true,
      message:"Information Updated Successfully"
    })


  } catch (error) {
    if(error instanceof AppError){
      return res.status(error.status).json({
        message:error.message
      })
    }
    return res.status(500).json({
        message: "Server couldn't process your request, so try again later"
      })
  }
}

