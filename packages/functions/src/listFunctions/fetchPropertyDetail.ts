import { prisma } from "@repo/database"
import { AppError } from "../error.js"

export async function fetchPropertyDetal(id:string) {
    try {
        const result = await prisma.property.findUnique({
            where: { id },
            select: {
              id: true,
              title: true,
              description: true,
              price: true,
              type: true,
              tole: true,
              verified: true,
              createdAt: true,
              noOfBedRooms: true,
              noOfRestRooms: true,
              landArea: true,
              noOfFloors: true,
              propertyAge: true,
              facingDirection: true,
              floorArea: true,
              roadSize: true,
              floorLevel: true,
          
              images: {
                select: {
                  id: true,
                  url: true,
                },
              },
          
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
          
              location: {
                select: {
                  id: true,
                  name: true,
                  municipality: {
                    select: {
                        id:true,
                      name: true,
                      district: {
                        select: {
                          id: true,
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
          
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          });

        if(!result){
            throw new AppError(404, "The property doesn't exist");
        }

        return {
            status: 200,
            result
        }
    }catch(e){
        if (e instanceof AppError) throw e;
        throw new AppError(500, "Bad Response from Server!!!")
    }
}