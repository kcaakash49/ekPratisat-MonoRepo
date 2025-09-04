import { authOptions } from "@repo/auth-config"
import { getServerSession } from "next-auth"


export default async function Home(){
  const  session  = await getServerSession(authOptions);
  console.log(session);
  return <div>
    Aakash
  </div>
}