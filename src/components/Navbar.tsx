import styles from "../styles/components/Navbar.module.css";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

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
                    <Image src="/icons/person.svg" alt="" width={24} height={24} />
                    <span>Sign in</span>
                </li>}
                {/* Rendering the sign out button if the user is signed in */}
                {session && <li onClick={() => signOut()} className={styles.navLink}>
                    <Image src="/icons/person.svg" alt="" width={24} height={24} />
                    <span>Sign out</span>
                </li>}
                
                <li onClick={() => pageReload()}>
                    <Image src="/icons/plus.svg" alt="" width={24} height={24} />
                    <span>New Report</span>
                </li>
            </ul>
        </nav>
    )
}