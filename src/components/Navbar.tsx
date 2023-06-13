import styles from "../styles/components/Navbar.module.css"
import { useSession, signIn, signOut } from "next-auth/react"

export default function Navbar (): JSX.Element {
    // Function to reload the page
    function pageReload (): void {
        window.location.reload()
    }

    // Retrieving the user's NextAuth.js session data
    const { data: session } = useSession()

    return (
        <nav>
            <ul>
                <li>Commits Analyzer</li>

                {/* Rendering the sign in button if the user is not signed in */}
                {!session && <li onClick={() => signIn()} className={styles.navLink}>
                    Sign in
                </li>}
                {/* Rendering the sign out button if the user is signed in */}
                {session && <li onClick={() => signOut()} className={styles.navLink}>
                    Sign out
                </li>}
                
                <li onClick={() => pageReload()}>New Report</li>
            </ul>
        </nav>
    )
}