import { authOptions } from "@repo/auth-config";
import CreateProperty from "@repo/components/addPropertyForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function AddProperty(){
    const session = await getServerSession(authOptions);

    if(!session?.user){
        redirect("/");
    }

    return (
        <CreateProperty user={session?.user}/>
    )
}