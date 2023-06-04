// Importing styles and useState hook from React
import styles from "@/styles/components/landing/Landing.module.css"
import { useState } from "react"
import Hero from "./Hero"

// Defining the Search interface
interface Search {
    user: string, 
    submit: boolean
}

// Defining the Props interface, which takes in Search and setSearch functions
interface Props {
    search: Search,
    setSearch: React.Dispatch<React.SetStateAction<Search>>,
    numCommits: number,
    setNumCommits: React.Dispatch<React.SetStateAction<number>>
}

// Defining the Home component, which takes in Props and returns a JSX element
export default function Home (props: Props): JSX.Element {

    // Returning the JSX element, which displays a search input and submit button
    return (
        <header>
            <Hero {...props} />
        </header>
    )
}