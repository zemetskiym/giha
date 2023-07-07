import { useState } from "react";
import styles from "@/styles/components/Loading.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Loading(): JSX.Element {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
    };

    return (
    <>
        {isVisible && (
        <div id={styles.loading}>
          <span>
            If the content is taking longer than expected to load, please consider opening a{" "} 
            <Link target="_blank" href="https://github.com/zemetskiym/giha/issues/new/choose">GitHub issue</Link>
            {" "}for further assistance.
          </span>
          <div id={styles.close} onClick={handleClose}>
            <Image
                src="/icons/close.svg"
                width={15}
                height={15}
                alt="Close"
            />
          </div>
        </div>
        )}
    </>
    );
}