import styles from "../styles/components/Navbar.module.css";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useWindowSizeContext } from '@/components/context';
import { useState } from "react";

export default function Navbar (): JSX.Element {
    // Define state for the mobile menu
    const [mobileMenu, setMobileMenu] = useState(false);

    // Retrieving the user's NextAuth.js session data
    const { data: session } = useSession()

    // Retrieving the window size
    const windowSize = useWindowSizeContext();

    // Function to reload the page
    function pageReload (): void {
        window.location.reload()
    }

    return (
        <nav id={styles.navbar}>
            {windowSize.width >= 500 && 
                <ul id={styles.navbarList}>
                    <li id={styles.title}>Commits Analyzer</li>

                    {/* Rendering the sign in button if the user is not signed in */}
                    {!session && <li onClick={() => signIn()} className={styles.navLink}>
                        <Image id={styles.personIcon} className={styles.icon} src="/icons/person.svg" alt="" width={14} height={14} />
                        <span className={styles.marginRight}>Sign in</span>
                    </li>}
                    {/* Rendering the sign out button if the user is signed in */}
                    {session && <li onClick={() => signOut()} className={styles.navLink}>
                        <Image id={styles.personIcon} className={styles.icon} src="/icons/person.svg" alt="" width={14} height={14} />
                        <span className={styles.marginRight}>Sign out</span>
                    </li>}
                    
                    <li onClick={() => pageReload()} className={styles.navLink}>
                        <Image id={styles.plusIcon} className={styles.icon} src="/icons/plus.svg" alt="" width={14} height={14} />
                        <span>New Report</span>
                    </li>
                </ul>
            }
            {windowSize.width < 500 && 
                <>
                <ul id={styles.evenNavbarList}>
                    <li onClick={() => setMobileMenu(prev => !prev)} className={styles.navLink}>
                        <Image className={styles.icon} src="/icons/hamburger-menu.svg" alt="Menu" width={24} height={24} />
                    </li>
                    <li onClick={() => pageReload()} className={styles.navLink}>
                        <Image className={styles.icon} src="/icons/plus.svg" alt="" width={24} height={24} />
                    </li>
                </ul>
                {mobileMenu && 
                <ul id={styles.dropdownMenu}>
                    <hr className={styles.hr} />
                    {/* Rendering the sign in button if the user is not signed in */}
                    {!session && <li onClick={() => signIn()} className={styles.navLink}>
                        <Image id={styles.personIcon} className={styles.icon} src="/icons/person.svg" alt="" width={14} height={14} />
                        <span className={styles.marginRight}>Sign in</span>
                    </li>}
                    {/* Rendering the sign out button if the user is signed in */}
                    {session && <li onClick={() => signOut()} className={styles.navLink}>
                        <Image id={styles.personIcon} className={styles.icon} src="/icons/person.svg" alt="" width={14} height={14} />
                        <span className={styles.marginRight}>Sign out</span>
                    </li>}
                    <hr className={styles.hr} />
                    <li onClick={() => pageReload()} className={styles.navLink}>
                        <Image id={styles.plusIcon} className={styles.icon} src="/icons/plus.svg" alt="" width={14} height={14} />
                        <span>New Report</span>
                    </li>
                </ul>
                }
                </>
            }
        </nav>
    )
}