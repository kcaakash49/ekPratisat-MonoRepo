import SignInForm from "@repo/components/signInForm";
import Link from "next/link";
import { Suspense } from "react";


export default function SignInPage() {
    return <div className="min-h-screen flex items-center justify-center bg-[var(--ek-bg-main)] dark:bg-[var(--ek-dark-page)] dark:text-[var(--ek-dark-text)] px-4">
        <div className="w-full max-w-md">
            <Suspense fallback={<div className="ek-surface min-h-72 rounded-3xl border" />}>
                <SignInForm/>
            </Suspense>
            <div className="text-center">

            Dont have an account? <Link href="/auth/signup" className="text-gold-700 dark:text-gold-400 hover:underline">Sign Up</Link>
            </div>
        </div>
    </div>
}
