// Import child components used in the parent component
import Sidebar from "../components/dashboard/Sidebar";

// Import client-side modules for user sessions and authentication
import { useSession } from "next-auth/react";

// Import necessary server-side modules for authentication handling
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export default function Dashboard() {
    // Retrieving the user's NextAuth.js session data
    const { data: session } = useSession();

    return (
        <>
            <Sidebar />
        </>
    )
}

// Define a server-side function to fetch the user's session data and handle authentication
export async function getServerSideProps(context) {
    // Fetch the user's session using the server-side function getServerSession
    const session = await getServerSession(context.req, context.res, authOptions);

    // If the user is not authenticated (no session found), manually redirect them to authenticate
    if (!session) {
        return {
            redirect: {
                destination: "/api/auth/signin/github",
                permanent: false, // Set permanent to false to indicate a temporary redirect
            },
        }
    }

    // If the user is authenticated (session found), return the session as a prop
    return {
        props: {
            session,
        },
    }
}
