
import { authOptions } from "@repo/auth-config";
import SignupForm from "@repo/components/signUpForm";
import { getServerSession } from "next-auth";

export default async function SignupPage() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <SignupForm userRole={session?.user?.role}/>
      </div>
    </div>
  );
}
