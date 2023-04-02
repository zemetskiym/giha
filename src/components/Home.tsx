import styles from "@/styles/components/Home.module.css"
import { useState } from "react"

interface Search {
    user: string, 
    submit: boolean
}

interface Props {
    search: Search;
    setSearch: React.Dispatch<React.SetStateAction<Search>>;
}

export default function Home (props: Props): JSX.Element {
    const { search, setSearch } = props;

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSearch((prev) => ({user: prev.user, submit: true}))
    }

    return (
        <form onSubmit={event => handleSubmit(event)}>
            <input 
                type="text" 
                onChange={event => setSearch(({user: event.target.value, submit: false}))}
                value={search.user}
                placeholder="Search for user..."
            />
            <button>Submit</button>
        </form>
    )
}