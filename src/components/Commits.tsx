import styles from "../styles/components/Commits.module.css"
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

// Define types/interfaces
interface File {
    patch: string;
    filename: string
}
interface Commit {
    commit: {
        author: {
            date: string
        }
    }
    files: Array<File>;
}
interface Props {
    commitData: Array<Commit | null>;
}

export default function Commits(props: Props): JSX.Element {
    
    // Destructure the props object
    const {commitData = []} = props
    const filteredCommitData = commitData.filter(Boolean) as Array<Commit>

    // Declare an empty array to store results
    const [results, setResults] = useState<Array<any>>([])

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