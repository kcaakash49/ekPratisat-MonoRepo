
import SignupForm from "@repo/components/signUpForm";

import Link from "next/link";


export default async function SignupPage() {
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--ek-bg-main)] dark:bg-[var(--ek-dark-page)] dark:text-[var(--ek-dark-text)] px-4">
      <div className="w-full max-w-md">
        <SignupForm/>
        <p className="text-sm mt-4 text-center">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-gold-700 dark:text-gold-400">Log in</Link>
      </p>
      </div>
    </div>
  );
}
