import { prisma } from "@repo/database";
import { AppError } from "../error.js";
import { LocationSchema } from "@repo/validators";

export async function fetchLocationTree(){
    try {
        const result = await prisma.district.findMany({
            include: {
                municipalities: {
                    include: {
                        wards: true
                    }
                }
            }
        });
        return {
            status: 200,
            result
        }
    }catch(error){
        throw new AppError(500, "Internal Error!!!")
    }
}

//add district
export async function addDistrict({name,userId} : LocationSchema){
    try{
        const ifExisting = await prisma.district.findFirst({
            where: {
                name: name
            }
        });

        if (ifExisting){
            throw new AppError(409, "District already exist!!!")
        }

        const district = await prisma.district.create({
            data: {
                name,
                addedById: userId
            }
        });

        return {
            status: 200,
            message: "District added duccessfully",

        }
    }catch(error){
        if (error instanceof AppError){
            throw error;
        };
        throw new AppError(500,"intenal Error");
    }
}

//add municipalities
export async function addMunicipality({name, userId, parentId} : LocationSchema){
    try{

        const result = await prisma.$transaction( async (tx) => {
            const ifMpExist = await tx.municipality.findFirst({
                where: {
                  districtId: parentId,
                  name: {
                    equals: name,
                    mode: "insensitive", // case-insensitive match
                  }
                }
              });
              
              if (ifMpExist) {
                throw new AppError(409, "Municipality already exists");
              }
              
            const mp = await tx.municipality.create({
                data: {
                    name,
                    addedById: userId,
                    districtId: parentId!,

                }
            })

            return {
                status: 200,
                message: "Municipality Successfully Added!!!"
            }
        })
        return result;
    }catch(error ){
        if (error instanceof AppError){
            throw error;
        };
        throw new AppError(500,"intenal Error");
    }
}


//add ward

export async function addWard({ name, userId, parentId} : LocationSchema){
    try {
        const ifExisting = await prisma.ward.findFirst({
            where: {
                municipalityId: parentId,
                name: {
                    equals: name,
                    mode: "insensitive"
                }
            }
        });
        if (ifExisting) {
            throw new AppError(409, "Ward already exists");
          }
        
        const ward = await prisma.ward.create({
            data: {
                name, addedById: userId, municipalityId: parentId!
            }
        })

        return {
            status : 200,
            message : "Ward Added Successfully"
        }

    }catch(error){
        if (error instanceof AppError){
            throw error;
        };
        throw new AppError(500,"intenal Error");
    }
}
    
