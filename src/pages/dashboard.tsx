// Import the necessary modules and components
import { useState } from 'react';
import Sidebar from "../components/dashboard/Sidebar";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { GetServerSidePropsContext } from "next";

// Define the Dashboard component
export default function Dashboard() {
    const [activeView, setActiveView] = useState<string>('dashboard')

    return (
        <>
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
        </>
    )
}

// Define a server-side function to fetch the user's session data and handle authentication
export async function getServerSideProps(context: GetServerSidePropsContext) {
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
