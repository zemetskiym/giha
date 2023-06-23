import styles from "../styles/components/Error.module.css";
import Image from "next/image";

interface Props {
    error: string;
}

export default function Commits(props: Props): JSX.Element {
    const { error } = props;

    return (
        <div id={styles.error}>
            <Image id={styles.errorIcon} src="/icons/error.svg" alt="Error" width={18} height={18} />
            <span id={styles.errorText}>{ error }</span>
        </div>
    )
};