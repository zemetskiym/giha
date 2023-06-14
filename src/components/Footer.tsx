import styles from "../styles/components/Profile.module.css";
import Link from "next/link";

export default function Languages(): JSX.Element {
    return (
        <footer>
            <hr />
            <div>
                <Link target="_blank" href="https://github.com/zemetskiym/commits-analyzer/blob/main/LICENSE">License</Link>
            </div>
            <div>
                <Link target="_blank" href="https://github.com/zemetskiym/commits-analyzer">GitHub Repository</Link>
            </div>
            <div>© {new Date().getFullYear()} Matthew Zemetskiy. Licensed under the MIT License.</div>
        </footer>
    )
}