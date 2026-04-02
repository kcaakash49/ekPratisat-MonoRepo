
import SignupForm from "@repo/components/signUpForm";

import Link from "next/link";


export default async function SignupPage() {
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <SignupForm/>
        <p className="text-sm mt-4 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-red-600">Log in</Link>
      </p>
      </div>
    </div>
  );
}
