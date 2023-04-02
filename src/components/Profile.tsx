import styles from "@/styles/components/Profile.module.css"
import Image from "next/image"

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

interface Props {
    userData: Partial<User>
    repoData: Array<Partial<Repo>>
}

export default function Profile (props: Props): JSX.Element {
    const {userData, repoData} = props
    const {name, login, avatar_url, public_repos, followers, following} = userData
    
    function stars() {
        let stars = 0
        repoData.forEach(repo => {
            if(repo.stargazers_count != undefined) stars += repo.stargazers_count
        })
        return stars
    }

    console.log(userData)
    console.log(repoData)

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