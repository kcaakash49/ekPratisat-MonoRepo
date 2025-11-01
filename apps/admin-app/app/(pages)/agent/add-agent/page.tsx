import { authOptions } from "@repo/auth-config";
import SignupForm from "@repo/components/signUpForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AddAgent(){
    const session = await getServerSession(authOptions);

    if(!session){
        redirect("/");
    }
    
    return (
        <SignupForm userRole={session.user.role}/>
    )
}