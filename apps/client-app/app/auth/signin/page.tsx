"use client";

import { useSession } from "next-auth/react";

export default function SignInPage(){
    const session = useSession();
    console.log(session.data?.user?.id);

    return <div>
        SiginInPage
    </div>
}