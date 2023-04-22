// Import necessary modules
import styles from "@/styles/components.Languages.module.css"
import { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js'
import { languageColors } from "../../public/languageColors";
import * as d3 from "d3";

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

// Define the functional component Languages and pass in Props
export default function Languages(props: Props): JSX.Element {

    // Destructure the props object
    const {commitData = []} = props
    const filteredCommitData = commitData.filter(Boolean) as Array<Commit>

    // Declare an empty array to store results
    const [results, setResults] = useState<Array<any>>([])

    // Define a helper function cleanUpDiff to remove unnecessary characters from a string
    function cleanUpDiff(diff: string) {
        // Split the diff string into an array of lines
        const lines = diff.split('\n');
        
        // Create a new array to store the cleaned up lines
        const cleanedLines = [];
        
        // Iterate through each line
        for (let i = 0; i < lines.length; i++) {
          // Check if the line starts with '+' or '-'
          if (lines[i].startsWith('+') || lines[i].startsWith('-')) {
            // Remove the '+' or '-' character from the beginning of the line
            const cleanedLine = lines[i].substring(1)
            
            // Add the cleaned up line to the array
            cleanedLines.push(cleanedLine)
          } else if (lines[i].startsWith('@@')) {
            // If the line starts with '@@', skip it (and the next line)
            i++
          }
        }
        
        // Join the cleaned up lines into a single string and return it
        return cleanedLines.join('\n');
    }

    // Define a helper function getFileExtension to get the file extension of a given filename
    function getFileExtension(filename: string): string {
        return filename.split('.').pop() || ''
    }

    function findCommitStats(commit: Commit) {
        // Clean up the diff string of the first file in the commit
        let cleanedDiff = cleanUpDiff(commit.files![0].patch)

        // Get the file extension of the first file in the commit
        const firstFileExtension = getFileExtension(commit.files![0].filename)

        // Use highlight.js to auto-detect the language of the cleaned up diff, based on the first file's extension
        const detectedLanguage = hljs.highlightAuto(cleanedDiff, [firstFileExtension]).language

        // If the detected language is not undefined, add an object with the language name and color to the results array
        if (detectedLanguage !== undefined) {
            // Get more information about the detected language from highlight.js
            const detectedLanguageInfo = hljs.getLanguage(detectedLanguage)

            // If we have information about the detected language and its name, add it to the results array
            if (detectedLanguageInfo != undefined && detectedLanguageInfo.name != undefined) {
                // If we have a color and date for the detected language, add the name, color, and date to the results array
                if (languageColors.hasOwnProperty(`${detectedLanguageInfo.name}`) && commit.commit.author.date != undefined) {
                    const languageName = detectedLanguageInfo.name
                    const languageColor = languageColors[languageName]
                    setResults(prevResults => [...prevResults, {language: languageName, color: languageColor, date: new Date(commit.commit.author.date)}])
                    return
                }
            }
        }

        // If any of the conditions are not met, append a null value to the results array
        setResults(prevResults => [...prevResults, null])
    }

    useEffect(() => {
        // Loop through each commit in commitData and extract the language of the first file
        for(let i = 0; i < commitData.length; i++) {
            if (commitData[i] != null) findCommitStats(commitData[i] as Commit)
        }
    }, [])

    // Define a function that creates a cumulative stacked area chart using D3.js.
    function cumulativeStackedAreaChart() {
        // Create a reference to the SVG element that will be rendered.
        const svgRef = useRef<SVGSVGElement>(null);

        // Use the useEffect hook to execute code after the component is mounted or updated.
        useEffect(() => {
            // Check if the SVG element and the required data are available.
            if (svgRef.current && results.length == filteredCommitData.length && results.filter((item) => item !== null).length > 0) {
                // Remove any null values from the results array.
                const resultsWithoutNull = results.filter((item) => item !== null).sort((a, b) => a.date - b.date);
                
                // Select the SVG element using D3.js.
                const svg = d3.select(svgRef.current);

                // Define the dimensions of the chart and its margins.
                const height = 600;
                const width = 1200;
                const margin = { top: 0.1 * height, right: 0.1 * width, bottom: 0.1 * height, left: 0.1 * width };

                // Determine the earliest and latest dates in the results array.
                const earliestDate: Date = resultsWithoutNull.reduce((min: Date, d: { language: string, color: string, date: Date }) => d.date < min ? d.date : min, resultsWithoutNull[0].date);
                const latestDate: Date = resultsWithoutNull.reduce((max: Date, d: { language: string, color: string, date: Date }) => d.date > max ? d.date : max, resultsWithoutNull[0].date);

                // Create a scale for the x-axis.
                const x = d3.scaleTime()
                    .domain([earliestDate, latestDate])
                    .range([margin.left, width - margin.right]);

                // Create a scale for the y-axis.
                const y = d3.scaleLinear()
                    .domain([0, resultsWithoutNull.length])
                    .range([height - margin.top,  margin.bottom]);

                const languageSet: Set<string> = new Set()
                resultsWithoutNull.map((commit) => {languageSet.add(commit.language)})

                // Create a stack generator using D3.js.
                const stack = d3.stack()
                    .keys(Array.from(languageSet))
                    .value((d, key) => {
                        const commits = resultsWithoutNull.filter((commit) => commit.language === key && commit.date <= d.date)
                        return commits.length
                    })                    
                // Use the stack generator to create a stacked data array.
                const stackedData = stack(resultsWithoutNull);
                console.log(stackedData)

                const colorScale: any = d3.scaleOrdinal()
                    .domain(stackedData.map(d => d.key))
                    .range(d3.schemePaired)

                // Create an area generator using D3.js.
                const area = d3.area()
                    .x((d: any) => x(d.data.date))
                    .y0((d: any) => y(d[0]))
                    .y1((d: any) => y(d[1]));

                // Add the x-axis to the chart.
                svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x));

                // Add the y-axis to the chart.
                svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y));

                // Add the stacked areas to the chart.
                svg.append("g")
                    .selectAll("path")
                    .data(stackedData)
                    .join("path")
                        .attr("fill", (d: any) => colorScale(d.key).toString())
                        .attr("d", area as any);
            }
        }, [results, svgRef]);

        // Return the SVG element with the specified dimensions.
        return <svg ref={svgRef} width="1200" height="600" />;
    }
    
    // Return the component JSX
    return (
        <>
            <h1>Languages</h1>
            <>
                {cumulativeStackedAreaChart()}
            </>
        </>
    )
}