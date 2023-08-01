import Sidebar from "../components/dashboard/Sidebar.tsx"
import { useSession, signIn } from "next-auth/react";

export default function Dashboard() {
    // Retrieving the user's NextAuth.js session data
    const { data: session } = useSession();

    // Signing in the user if the user has not done so already
    if (!session) signIn("github");

    return (
        <>
            <Sidebar />
        </>
    )
}
