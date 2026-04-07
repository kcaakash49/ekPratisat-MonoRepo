import SignInForm from "@repo/components/signInForm";
import Link from "next/link";


export default function SignInPage() {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="w-full max-w-md">
            <SignInForm/>
            <div className="text-center">

            Dont have an account? <Link href="/auth/signup" className="text-blue-500 hover:underline">Sign Up</Link>
            </div>
        </div>
    </div>
}