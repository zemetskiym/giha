// Importing styles and Image component from Next.js
import styles from "@/styles/components/Profile.module.css"
import Image from "next/image"

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
    
    // Defining a function to calculate the total number of stars for all repos
    function stars() {
        let stars = 0
        repoData.forEach(repo => {
            if(repo.stargazers_count != undefined) stars += repo.stargazers_count
        })
        return stars
    }

    // Logging the user and repo data for debugging purposes
    console.log(userData)
    console.log(repoData)

    // Returning the JSX element, which displays user and repo data
    return (
        <header>
            <h1>Profile</h1>
            <section>
                {name != null && <span>{name}</span>}
                <small>{login}</small>
            </section>
            <section>
                {avatar_url != undefined && <Image alt="" src={avatar_url} height={100} width={100} />}
                <span>
                    {stars()} {stars() == 1 ? "Star" : "Stars"}
                </span>
                <span>
                    {public_repos} Repos
                </span>
                <span>
                    {followers} {followers == 1 ? "Follower" : "Followers"}
                </span>
                <span>
                    {following} Following
                </span>
            </section>
        </header>
    )
}