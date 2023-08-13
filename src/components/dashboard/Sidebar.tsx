import styles from "../../styles/components/dashboard/Sidebar.module.css";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {useState} from "react";
import { useDarkModeContext } from "../darkModeContext";

// Define types/interfaces
interface Props {
    activeView: string;
    setActiveView: React.Dispatch<React.SetStateAction<string>>;
}

// Sidebar component
export default function Sidebar(props: Props): JSX.Element {
    // Destructure the props object
    const {activeView, setActiveView} = props;

    // Destructure the dark mode context object
    const {darkMode, setDarkMode} = useDarkModeContext();

    // State for profile menu popup
    const [profileMenuPopup, setProfileMenuPopout] = useState<boolean>(false)
    
    return (
        <nav data-testid='sidebar' id={styles.sidebar}>
            <ul>
                {/* Sidebar navigation items */}
                <li><Link data-testid="home" href="/">Home</Link></li>
                <li onClick={() => setActiveView('dashboard')}>Dashboard</li>
                <li data-testid="analysis" onClick={() => setActiveView('analysis')}>Analysis</li>
                <li><Link data-testid="issue" href="https://github.com/zemetskiym/giha/issues/new/choose" target="_blank">Raise an issue</Link></li>
                <li><Link data-testid="repository" href="https://github.com/zemetskiym/giha" target="_blank">Github repository</Link></li>
                <li><Link data-testid="license" href="https://github.com/zemetskiym/giha/blob/main/LICENSE" target="_blank">License</Link></li>
                <li><Link data-testid="email" href="mailto:gihanalysis@proton.me" target="_blank">Email</Link></li>
                <li>
                    {/* Dark mode toggle */}
                    <span data-testid="dark-mode-button" onClick={() => setDarkMode(prev => !prev)}>
                        {darkMode ? 
                            <div data-testid="dark-mode-icon"></div>
                            :
                            <div></div>
                        }
                    </span>
                    {/* Profile menu */}
                    { profileMenuPopup == true &&
                    <ul>
                        <li data-testid="profile-menu-signout" onClick={() => signOut()}>Profile menu signout</li>
                    </ul>
                    }
                    <span data-testid="profile-menu" onClick={() => setProfileMenuPopout(prev => !prev)}>Profile menu</span>
                </li>
            </ul>
        </nav>
    )
}
