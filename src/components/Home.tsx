import styles from "@/styles/components/Home.module.css"
import { useState } from "react"

export default function Home(): JSX.Element {
    const [search, setSearch] = useState("")

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
    }

    return (
        <form onSubmit={event => handleSubmit(event)}>
            <input 
                type="text" 
                onChange={event => setSearch(event.target.value)}
                value={search}
                placeholder="Search for user..."
            />
            <button>Submit</button>
        </form>
    )
}