import styles from "@/styles/components/landing/Footer.module.css";
import Link from "next/link";

export default function Languages(): JSX.Element {
    return (
        <footer id={styles.footer}>
            <hr id={styles.hr} />
            <div id={styles.links}>
                <Link className={styles.link} target="_blank" href="https://github.com/zemetskiym/giha/blob/main/LICENSE">License</Link>
                <Link className={styles.link} target="_blank" href="https://github.com/zemetskiym/giha">GitHub Repository</Link>
                <Link className={styles.link} href="/dashboard">Dashboard (Experimental)</Link>
            </div>
            <div id={styles.copyright}>© {new Date().getFullYear()} Matthew Zemetskiy. Licensed under the MIT License.</div>
        </footer>
    )
}
