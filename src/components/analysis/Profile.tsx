// Importing styles and Image component from Next.js
import styles from "@/styles/components/Profile.module.css";
import Image from "next/image";
import { useWindowSizeContext } from '@/components/context';

// Defining the User and Repo interfaces
interface User {
    name: string | null,
    login: string,
    avatar_url: string,
    public_repos: number,
    followers: number,
    following: number
}

interface Repo {
    stargazers_count: number
}

// Defining the Props interface, which takes in partial User and Repo data
interface Props {
    userData: Partial<User>
    repoData: Array<Partial<Repo>>
}

// Defining the Profile component, which takes in Props and returns a JSX element
export default function Profile (props: Props): JSX.Element {
    const {userData, repoData} = props
    const {name, login, avatar_url, public_repos, followers, following} = userData

    // Import the window size context
    const windowSize = useWindowSizeContext();
    
    // Defining a function to calculate the total number of stars for all repos
    function stars() {
        let stars = 0
        repoData.forEach(repo => {
            if(repo.stargazers_count != undefined) stars += repo.stargazers_count
        })
        return stars
    }

    // Returning the JSX element, which displays user and repo data
    return (
        <section id={styles.profile}>
            <section id={styles.user}>
                {name != null && <span id={styles.name}>{name}</span>}
                <small id={styles.login}>{login}</small>
            </section>
            <section id={styles.stats}>
                <div id={styles.line}></div>
                {avatar_url != undefined && <Image id={styles.avatar} alt="" src={avatar_url} height={windowSize.width >= 300 ? 100: 50} width={windowSize.width >= 300 ? 100: 50} />}
                <span className={styles.statBox}>
                    <span className={styles.statLabel}>Stars</span>{stars()}
                </span>
                <span className={styles.statBox}>
                    <span className={styles.statLabel}>Repos</span>{public_repos}
                </span>
                {windowSize.width >= 550 && <span className={styles.statBox}>
                    <span className={styles.statLabel}>Followers</span>{followers}
                </span>}
                {windowSize.width >= 550 &&<span className={styles.statBox}>
                    <span className={styles.statLabel}>Following</span>{following}
                </span>}
            </section>
        </section>
    )
}