import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
export async function decodeToken(){
     const cookieStore = await cookies();
     const token = cookieStore.get("accessToken")?.value;
    
     if (!token) {
        return null;
     }

     try {
        const { payload } = await jwtVerify(token, SECRET);
        return payload.userId;
     }catch(error){
        return null;
     }
}