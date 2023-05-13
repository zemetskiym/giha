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
        const repo = url.match(regex)![1]

        // Extract the commit date from the Commit object.
        const date = new Date(object.commit.author.date)

        // Check that both the repository name and commit date are not null before returning them in an object.
        if (repo != null && date != null) return ({repo: repo, date: date})
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

    function findMaxObjectsWithSameRepo(set: Set<string>, data: Array<any>): number {
        // Initialize an array called 'maxObjects' with a single value of 1
        const maxObjects = [1];
        
        // Loop through each string in the 'set'
        for (const repo of set) {
            // Create a new array called 'repoCommits' that contains all the elements in 'data'
            // where the 'language' property equals the current 'repo' string
            const repoCommits = data.filter((commit) => commit.language === repo);
            
            // Push the length of 'repoCommits' array into the 'maxObjects' array
            maxObjects.push(repoCommits.length);
        }
        
        // Return the maximum value of all the elements in the 'maxObjects' array
        return Math.max(...maxObjects);
    }

    function barcodePlot(): JSX.Element {
        // Check if the required data is available.
        const hasData = results && results.length === filteredCommitData.length && results.filter((item) => item !== null).length > 1

        // Create a reference to the SVG element that will be rendered.
        const svgRef = useRef<SVGSVGElement>(null);

        // Use the useEffect hook to execute code after the component is mounted or updated.
        useEffect(() => {
            if(hasData) {
                // Remove any null values from the results array.
                const resultsWithoutNull = results.filter((item) => item !== null).sort((a, b) => a.date - b.date);

                // Select the SVG element using D3.js.
                const svg = d3.select(svgRef.current);

                // Define the dimensions of the chart and its margins.
                const height = 600;
                const width = 1200;
                const margin = { top: 0.1 * height, right: 0.1 * width, bottom: 0.1 * height, left: 0.1 * width };

                // Determine the earliest and latest dates in the results array.
                const earliestDate: Date = resultsWithoutNull.reduce((min: Date, d: {repo: string, date: Date}) => d.date < min ? d.date : min, resultsWithoutNull[0].date);
                const latestDate: Date = resultsWithoutNull.reduce((max: Date, d: {repo: string, date: Date}) => d.date > max ? d.date : max, resultsWithoutNull[0].date);

                // Create a scale for the x-axis.
                const x = d3.scaleTime()
                    .domain([earliestDate, latestDate])
                    .range([margin.left, width - margin.right]);

                // Define the x-axis with tick lines, guidelines, and no axis line.
                const xAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) => g
                    .call(d3.axisBottom(x))
                    .call((g: d3.Selection<SVGGElement, unknown, null, undefined>) => g.selectAll(".tick line").clone()
                        .attr("stroke-opacity", 0.1)
                        .attr("y1", -height + margin.bottom + margin.top))
                    .call((g: d3.Selection<SVGGElement, unknown, null, undefined>) => g.selectAll(".domain").remove())

                // Create a lanugage set to store unique "repo" values
                const repoSet: Set<string> = new Set()
                resultsWithoutNull.map((commit) => {repoSet.add(commit.repo)})

                // Create a scale for the y-axis.
                const y = d3.scaleBand()
                    .domain(repoSet)
                    .rangeRound([margin.top, height - margin.bottom])
                    .padding(0.1)

                // Add the x-axis to the chart.
                svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(xAxis)

                // Add the y-axis to the chart.
                svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y))

                // create x-axis label
                svg.append("text")
                    .attr("class", "x label")
                    .attr("text-anchor", "end")
                    .attr("x", width - margin.right)
                    .attr("y", height)
                    .text("Date of commit")

                // Create bars for data
                svg.append("g")
                        .attr("fill", "steelblue")
                        .attr("stroke-width", 10)
                        .attr("pointer-events", "all")
                    .selectAll("rect")
                    .data(resultsWithoutNull)
                    .join("rect")
                        .attr("x", d => x(d.date) - 0.75)
                        .attr("y", d => y(d.repo)!)
                        .attr("width", 1.5)
                        .attr("height", y.bandwidth())
                    .append("title")
                        .text(d => `${d.date.toDateString()} ${d.repo}`);
            }
            
        }, [results, svgRef]);

        // Return the SVG element with the specified dimensions.
        if (hasData) return <svg ref={svgRef} width="1200" height="600" />;
        if (!hasData) return <p>There is not enough data available to visualize the chart. Please try again later.</p>
        return <p>There is not enough data available to visualize the chart. Please try again later.</p>
    }
    
    // Return the component JSX
    return (
        <>
            <h1>Commits</h1>
            <>
                {barcodePlot()}
            </>
        </>
    )
} 