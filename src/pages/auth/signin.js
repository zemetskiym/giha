import { signIn, getCsrfToken, getProviders } from 'next-auth/react';
import Image from 'next/image';
import styles from '../../styles/Signin.module.css';
import Logo from '@/components/Logo';
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";

const Signin = ({ csrfToken, providers }) => {
    const { data: session } = useSession();
    const router = useRouter();
    if (session) {
        router.push("/")
        return null // Render nothing while redirecting
    }

    return (
        <section id={styles.signIn} style={{ overflow: 'hidden' }}>
        <div className={styles.wrapper} />
        <div className={styles.content}>
            <div className={styles.cardWrapper}>
            <div id={styles.cardHeader} >   
                <Image id={styles.cardLogo} src="/icons/lock.svg" alt="lock" width={44} height={44} />
                <h1 id={styles.title}>OAuthenticity</h1>
            </div>
            <div className={styles.cardContent}>
                {providers &&
                Object.values(providers).map(provider => (
                    <div key={provider.name} style={{ marginBottom: 0 }}>
                    <button onClick={() => signIn(provider.id)} >
                        Sign in with{' '} {provider.name}
                    </button>
                    </div>
                ))}
            </div>
            </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src='/login_pattern.svg' alt='Pattern Background' layout='fill' className={styles.styledPattern} />
        </section>
    )
}

export default Signin

export async function getServerSideProps(context) {
    const providers = await getProviders()
    const csrfToken = await getCsrfToken(context)
    return {
        props: {
        providers,
        csrfToken
        },
    }
}