import styles from "../styles/components/Footer.module.css";
import Link from "next/link";

export default function Languages(): JSX.Element {
    return (
        <footer id={styles.footer}>
            <hr id={styles.hr} />
            <div id={styles.links}>
                <Link className={styles.link} target="_blank" href="https://github.com/zemetskiym/commits-analyzer/blob/main/LICENSE">License</Link>
                <Link className={styles.link} target="_blank" href="https://github.com/zemetskiym/commits-analyzer">GitHub Repository</Link>
            </div>
            <div id={styles.copyright}>© {new Date().getFullYear()} Matthew Zemetskiy. Licensed under the MIT License.</div>
        </footer>
    )
}