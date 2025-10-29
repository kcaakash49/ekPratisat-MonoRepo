import { authOptions } from "@repo/auth-config";
import { AddPropertyForm } from "@repo/components/addPropertyForm";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function AddProperty(){
    const session = await getServerSession(authOptions);

    if(!session?.user){
        redirect("/");
    }

    return (
        <div className="px-4">
      <div className="w-full max-w-7xl mx-auto ">
        <AddPropertyForm user={session.user.role}/>
      </div>
    </div>
    )
}