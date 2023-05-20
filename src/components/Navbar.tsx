import styles from "../styles/components/Navbar.module.css"

export default function Navbar (): JSX.Element {
    // Function to reload the page
    function pageReload (): void {
        window.location.reload()
    }

    return (
        <nav>
            <ul>
                <li>Commits Analyzer</li>
                <li onClick={() => pageReload()}>New Report</li>
            </ul>
        </nav>
    )
}