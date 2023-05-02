import styles from "../styles/components/Commits.module.css"
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

// Define types/interfaces
interface Parent {
    url: string
}
interface File {
    patch: string,
    filename: string
}
interface Commit {
    commit: {
        author: {
            date: string
        }
    },
    parents: Array<Parent>,
    files: Array<File>
}
interface Props {
    commitData: Array<Commit | null>
}

export default function Commits(props: Props): JSX.Element {
    
    // Destructure the props object
    const {commitData = []} = props
    const filteredCommitData = commitData.filter(Boolean) as Array<Commit>

    // Declare an empty array to store results
    const [results, setResults] = useState<Array<any>>([])

    // This function takes a Commit object as input and returns an object with repository name and commit date.
    function commitDateAndRepo (object: Commit): object | null {
        // Extract the URL of the parent commit from the Commit object.
        const url = object.parents[0].url

        // Define a regular expression pattern to extract the repository name from the URL.
        const regex = /https:\/\/api\.github\.com\/repos\/(.*)\/commits\//;

        // Extract the repository name from the URL using the regular expression pattern.
        // The '!' operator is used to assert that the match function returns a non-null value.
        const repositoryName = url.match(regex)![1]

        // Extract the commit date from the Commit object.
        const date = object.commit.author.date

        // Check that both the repository name and commit date are not null before returning them in an object.
        if (repositoryName != null && date != null) return ({repositoryName: repositoryName, date: date})
        else return null
    }

    useEffect(() => {
        // Loop through each commit in commitData and extract the date and repo
        for(let i = 0; i < commitData.length; i++) {
            if (commitData[i] != null) {
                const commitObj = commitDateAndRepo(commitData[i] as Commit)
                setResults(prevResults => [...prevResults, commitObj])
            }
        }
    }, [])

    function cumulativeStackedAreaChart(): JSX.Element {
        // Create a reference to the SVG element that will be rendered.
        const svgRef = useRef<SVGSVGElement>(null);

        // Use the useEffect hook to execute code after the component is mounted or updated.
        useEffect(() => {
            // Remove any null values from the results array.
            const dataWithoutNull = results.filter((item) => item !== null).sort((a, b) => a.date - b.date);

            // Define the dimensions of the chart and its margins.
            const height = 600;
            const width = 1200;
            const margin = { top: 0.1 * height, right: 0.1 * width, bottom: 0.1 * height, left: 0.1 * width };
        }, [svgRef]);

        // Return the SVG element with the specified dimensions.
        return <svg ref={svgRef} width="1200" height="600" />;
    }
    
    // Return the component JSX
    return (
        <>
            <h1>Commits</h1>
            <>
                {cumulativeStackedAreaChart()}
            </>
        </>
    )
} 