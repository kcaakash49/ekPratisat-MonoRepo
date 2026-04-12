import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export default async function MyListingPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) redirect("/auth/signin");

    try {
        // 1. Verify Token
        const { payload } = await jwtVerify(token, SECRET);
        const userId = payload.id;

        // 2. Fetch Data
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/listing/my-listings`, {
            headers: { 'Cookie': cookieStore.toString() },
            next: { tags: [`listings-${userId}`] },
            cache: 'force-cache'
        });

        // 3. Check for specific status codes (like 401/403)
        if (res.status === 401) redirect("/auth/signin");

        if (!res.ok) {
            // This is where you return the "Failed" UI instead of throwing
            return (
                <div className="p-4 border border-red-200 bg-red-50 rounded">
                    <p className="text-red-600">Failed to load listings. Please try again later.</p>
                </div>
            );
        }

        const data = await res.json();

        return (
            <div>
                <h1>My Listings</h1>
                {/* Render your listings here */}
                {data.listing.length === 0 ? (
                    <p>You haven't posted any properties yet.</p>
                ) : (
                    <div>My listing</div>
                )}
            </div>
        );

    } catch (error:unknown) {
        console.error("Server Page Error:", error);
        
        // If JWT fails or network is down, you handle it here
        // If it's a JWT error specifically, redirect to login
        if (error instanceof Error) {
        // Now TypeScript knows 'message' and 'name' exist
        if (error.name === 'JWTExpired' || error.name === 'JWSSignatureVerificationFailed') {
            redirect("/auth/signin");
        }
        
        console.log(error.message); 
    }
        return (
            <div className="p-4 border border-orange-200 bg-orange-50 rounded">
                <p className="text-orange-700">Something went wrong while loading your dashboard.</p>
            </div>
        );
    }
}