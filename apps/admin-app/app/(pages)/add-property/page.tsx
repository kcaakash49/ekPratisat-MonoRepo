import { authOptions } from "@repo/auth-config";
import { AddPropertyForm } from "@repo/components/addPropertyForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function AddProperty() {
    const session = await getServerSession(authOptions);

    if(!session){
        redirect("/")
    }

    const user = session?.user.role;

    return (
        <AddPropertyForm user={user}/>
    )
}