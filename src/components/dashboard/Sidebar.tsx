import styles from "../../styles/components/dashboard/Sidebar.module.css";
import Link from "next/link";
import {useState} from "react";
import { useDarkModeContext } from "../darkModeContext";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";

// Define types/interfaces
interface Props {
    activeView: string;
    setActiveView: React.Dispatch<React.SetStateAction<string>>;
}

// Sidebar component
export default function Sidebar(props: Props): JSX.Element {
    // Destructure the props object
    const {activeView, setActiveView} = props;

    // Retrieving the user's NextAuth.js session data
    const { data: session } = useSession();

    // Destructure the dark mode context object
    const {darkMode, setDarkMode} = useDarkModeContext();

    // State for profile menu popup
    const [profileMenuPopup, setProfileMenuPopout] = useState<boolean>(false)
    
    return (
        <nav data-testid='sidebar' id={styles.sidebar}>
            <ul id={styles.sidebarList}>
                {/* Sidebar navigation items */}
                <li id={styles.title}>GIHA</li>
                <li className={styles.label}><small>Navigation</small></li>
                <li className={styles.optionContainer}>
                    <Link className={styles.option} data-testid="home" href="/">
                        <Image className={styles.optionIcon} src="/icons/home.svg" alt="" height={20} width={20} />
                        Home
                    </Link>
                </li>
                <li style={activeView == "dashboard" ? {backgroundColor: "#292A32" } : {}} className={styles.optionContainer} onClick={() => setActiveView('dashboard')}>
                    <Image className={styles.optionIcon} src="/icons/dashboard.svg" alt="" height={20} width={20} />
                    <span className={styles.option}>Dashboard</span>
                </li>
                <li style={activeView == "analysis" ? {backgroundColor: "#292A32"} : {}} className={styles.optionContainer} data-testid="analysis" onClick={() => setActiveView('analysis')}>
                    <Image className={styles.optionIcon} src="/icons/bar-chart.svg" alt="" height={20} width={20} />
                    <span className={styles.option}>Analysis</span>
                </li>
                <li className={styles.label}><small>External Links</small></li>
                <li className={styles.optionContainer}>
                    <Image className={styles.optionIcon} src="/icons/issue.svg" alt="" height={20} width={20} />
                    <Link data-testid="issue" className={styles.option} href="https://github.com/zemetskiym/giha/issues/new/choose" target="_blank">Raise an issue</Link>
                </li>
                <li className={styles.optionContainer}>
                    <Image className={styles.optionIcon} src="/icons/github.svg" alt="" height={20} width={20} />
                    <Link data-testid="repository" className={styles.option} href="https://github.com/zemetskiym/giha" target="_blank">Github repository</Link>
                </li>
                <li className={styles.optionContainer}>
                    <Image className={styles.optionIcon} src="/icons/license.svg" alt="" height={20} width={20} />
                    <Link data-testid="license" className={styles.option} href="https://github.com/zemetskiym/giha/blob/main/LICENSE" target="_blank">License</Link>
                </li>
                {/* Contact items */}
                <li className={styles.label}><small>Contact</small></li>
                <li className={styles.optionContainer}>
                    <Image className={styles.optionIcon} src="/icons/mail.svg" alt="" height={20} width={20} />
                    <Link data-testid="email" className={styles.option} href="mailto:gihanalysis@proton.me" target="_blank">Email</Link>
                </li>
                {/* Additional settings, located at the bottom */}
                <li id={styles.bottomElements}>
                    {/* Divider */}
                    <div id={styles.divider}></div>
                    {/* Dark mode toggle */}
                    <div data-testid="dark-mode-button" id={styles.darkModeButton} onClick={() => setDarkMode(prev => !prev)}>
                        {darkMode ? 
                            <div className={styles.optionContainer} data-testid="dark-mode-icon">
                                <Image className={styles.optionIcon} src="/icons/light-mode.svg" alt="" height={20} width={20} />
                                <span className={styles.option}>Disable dark mode</span>
                            </div>
                            :
                            <div className={styles.optionContainer}>
                                <Image className={styles.optionIcon} src="/icons/dark-mode.svg" alt="" height={20} width={20} />
                                <span className={styles.option}>Enable dark mode</span>
                            </div>
                        }
                    </div>
                    {/* Profile menu */}
                    { profileMenuPopup == true &&
                    <ul id={styles.popup}>
                        <li id={styles.popupSignout} data-testid="profile-menu-signout" onClick={() => signOut()}>
                            <Image className={styles.optionIcon} src="/icons/logout.svg" alt="" height={20} width={20} />
                            <span>Logout</span>
                        </li>
                    </ul>
                    }
                    <div data-testid="profile-menu" id={styles.profileMenu} onClick={() => setProfileMenuPopout(prev => !prev)}>
                        {session?.user?.image ? 
                            <Image src={session?.user?.image} alt="" height={20} width={20} id={styles.profileIcon} />
                            :
                            <Image src="/icons/settings.svg" alt="" height={20} width={20} className={styles.optionIcon} />
                        }
                        <span id={styles.profileEmail}>{session?.user?.email || "Settings"}</span>
                        <Image className={styles.optionIcon} id={styles.profileMenuButton} src="/icons/dots.svg" alt="Menu" height={20} width={20} />
                    </div>
                </li>
            </ul>
        </nav>
    )
}
