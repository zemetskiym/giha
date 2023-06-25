import styles from "../styles/components/Navbar.module.css";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useWindowSizeContext } from '@/components/context';
import { useEffect, useRef, useState } from "react";
import Logo from "@/components/Logo";
import Link from "next/link";

export default function Navbar (): JSX.Element {
    // Define state for the mobile menu
    const [mobileMenu, setMobileMenu] = useState(false);
    const mobileMenuRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
          if (
            mobileMenuRef.current &&
            !mobileMenuRef.current.contains(event.target as Node)
          ) {
            setMobileMenu(false);
          }
        };
    
        document.addEventListener('mousedown', handleOutsideClick);
    
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

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
            {windowSize.width >= 600 && 
                <ul id={styles.navbarList}>
                    <li onClick={() => pageReload()} className={styles.navLink}>
                        <Logo height={40} width={40} />
                    </li>
                    <li onClick={() => pageReload()} className={styles.navLink} id={styles.title}>OAuthenticity</li>
                    <li className={styles.leftNavLink}>
                        <Link id={styles.home} href="/">Home</Link>
                    </li>

                    {/* Rendering the sign in button if the user is not signed in */}
                    {!session && <li onClick={() => signIn()} className={styles.leftNavLink}>
                        Sign in
                    </li>}
                    {/* Rendering the sign out button if the user is signed in */}
                    {session && <li onClick={() => signOut()} className={styles.leftNavLink}>
                        Sign out
                    </li>}
                    
                    <li onClick={() => pageReload()} className={styles.leftNavLink}>
                        New Report
                    </li>
                    <li className={styles.leftNavLink} id={styles.github}>
                        <Link target="_blank" href="https://github.com/zemetskiym/oauthenticity">
                            <Image src="/icons/Github.svg" className={styles.icon} alt="Github" width={24} height={24} />
                        </Link>
                    </li>
                </ul>
            }
            {windowSize.width < 600 && 
                <>
                <ul id={styles.evenNavbarList}>
                    <li onClick={() => setMobileMenu(prev => !prev)} className={styles.navLink}>
                        <Image className={styles.icon} src="/icons/hamburger-menu.svg" alt="Menu" width={24} height={24} />
                    </li>
                    <li onClick={() => pageReload()} className={styles.navLink}>
                        <Logo height={40} width={40} />
                    </li>
                    <li onClick={() => pageReload()} className={styles.navLink}>
                        <Image className={styles.icon} src="/icons/plus.svg" alt="" width={24} height={24} />
                    </li>
                </ul>
                {mobileMenu && 
                <ul id={styles.dropdownMenu} ref={mobileMenuRef}>
                    <hr className={styles.hr} />
                    {/* Rendering the sign in button if the user is not signed in */}
                    {!session && <li onClick={() => signIn()} className={styles.navLink}>
                        Sign in
                    </li>}
                    {/* Rendering the sign out button if the user is signed in */}
                    {session && <li onClick={() => signOut()} className={styles.navLink}>
                        Sign out
                    </li>}
                    <hr className={styles.hr} />
                    <li onClick={() => pageReload()} className={styles.navLink}>
                        New Report
                    </li>
                </ul>
                }
                </>
            }
        </nav>
    )
}