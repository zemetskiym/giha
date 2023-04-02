// Importing styles and useState hook from React
import styles from "@/styles/components/Home.module.css"
import { useState } from "react"

// Defining the Search interface
interface Search {
    user: string, 
    submit: boolean
}

// Defining the Props interface, which takes in Search and setSearch functions
interface Props {
    search: Search;
    setSearch: React.Dispatch<React.SetStateAction<Search>>;
}

// Defining the Home component, which takes in Props and returns a JSX element
export default function Home (props: Props): JSX.Element {
    const { search, setSearch } = props;

    // Defining a function to handle form submissions
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSearch((prev) => ({user: prev.user, submit: true}))
    }

    // Returning the JSX element, which displays a search input and submit button
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