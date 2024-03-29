// Import necessary modules
import styles from "@/styles/components/Languages.module.css"
import { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js'
import { languageColors } from "../../../public/languageColors";
import * as d3 from "d3";
import { useWindowSizeContext } from '@/components/context';
import Image from "next/image";

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
    commitData: Array<Commit | null>
}

// Define the functional component Languages and pass in Props
export default function Languages(props: Props): JSX.Element {
    // Import the window size context
    const windowSize = useWindowSizeContext();

    // Destructure the props object
    const {commitData = []} = props;
    const filteredCommitData = commitData.filter(Boolean) as Array<Commit>;

    // Declare an empty array to store results
    const [results, setResults] = useState<Array<any>>([]);

    // Create a reference to the SVG element that will be rendered.
    const swatchLegendSvgRef = useRef<SVGSVGElement>(null);
    const areaChartSvgRef = useRef<SVGSVGElement>(null);
    const pieChartSvgRef = useRef<SVGSVGElement>(null);

    // Create React state to hold the current chart
    const [currentChart, setCurrentChart] = useState<string>("CumulativeStackedAreaChart");

    // Check if the required commit data is available.
    const hasData = results && results.length === commitData.length && results.filter((item) => item !== null).length > 1;

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
            if (
                commitData[i] &&
                commitData[i]!.files != null &&
                commitData[i]!.files.length > 0 &&
                commitData[i]!.files[0].patch != null
            ) {findCommitStats(commitData[i] as Commit);}
            else {setResults(prevResults => [...prevResults, null])}
        }
    }, [])

    function handleDownload(svgRef: React.RefObject<SVGSVGElement>) {
        // Get the SVG element
        const chartSvgElement = svgRef.current;
        const legendSvgElement = swatchLegendSvgRef.current;

        if (chartSvgElement != null && legendSvgElement != null) {
            // Convert the SVG element to a Blob
            const chartSvgData = new XMLSerializer().serializeToString(chartSvgElement);
            const legendSvgData = new XMLSerializer().serializeToString(legendSvgElement);

            // Combine the SVG data into one SVG string
            const combinedSvgData = `<svg>${legendSvgData}${chartSvgData}</svg>`;

            // Convert the combined SVG data to a Blob
            const blob = new Blob([combinedSvgData], { type: "image/svg+xml" });

            // Create a URL for the Blob
            const url = URL.createObjectURL(blob);

            // Create a temporary link element and click it programmatically to trigger the download
            const link = document.createElement("a");
            link.href = url;
            if(svgRef == areaChartSvgRef) {
                link.download = "commit-languages-area-chart.svg";
            } else {
                link.download = "commit-languages-pie-chart.svg";
            }
            link.click();

            // Clean up the URL and remove the temporary link element
            URL.revokeObjectURL(url);
        }
    }

    function SwatchLegend() {
        // Remove any null values from the results array.
        const resultsWithoutNull = results.filter((item) => item !== null).sort((a, b) => a.date - b.date);
                
        // Create a new array to store the unique "language" values and colors
        const languageColorsArray: Array<{language: string, color: string}> = [];
        resultsWithoutNull.map((commit) => {
            if (
                commit.language != null &&
                !languageColorsArray.some(
                  (item) => item.language === commit.language && item.color === commit.color
                )
            ) {
                languageColorsArray.push({language: commit.language, color: commit.color})
            }
        });

        // Check if the required data is available.
        const hasData = results && results.length === commitData.length && results.filter((item) => item !== null).length > 1;

        // Use the useEffect hook to execute code after the component is mounted or updated.
        useEffect(() => {
            if(hasData) {
                // Select the SVG element using D3.js.
                const svg = d3.select(swatchLegendSvgRef.current);

                // Clear the SVG by removing all existing elements.
                svg.selectAll('*').remove();

                // Set the base font size.
                const baseFontSize = 16; // in pixels

                // Set the width and margins of the SVG element.
                const width = Math.min(windowSize.width, 1200);
                const swatchHeight = 15;
                const swatchWidth = 15;
                let margin: {top: number, right: number, bottom: number, left: number};
                if (windowSize.width < 1200) {
                    margin = {top: 0, right: 10, bottom: 10, left: 10};
                } else {
                    margin = {top: 0, right: 0, bottom: 10, left: 0};
                }
                
                // Append a new group element with a rect and text for each language.
                for (let i = 0; i < languageColorsArray.length; i++) {
                    // Calculate the position of each element in a row of 4.
                    let rowPosition: number;
                    if (windowSize.width < 300) {
                        rowPosition = i % 2;
                    }
                    else if (windowSize.width < 900) {
                        rowPosition = i % 4;
                    } else {
                        rowPosition = i % 6;
                    }

                    // Based on the rowPosition calculate the x and y coordinates.
                    let swatchX: number;
                    let swatchY: number;
                    if (windowSize.width < 300) {
                        swatchX = (width - margin.left - margin.right) / 2 * rowPosition + margin.left;
                        swatchY = Math.floor(i / 2) * (swatchHeight + 1) + margin.top;
                    }
                    else if (windowSize.width < 900) {
                        swatchX = (width - margin.left - margin.right) / 4 * rowPosition + margin.left;
                        swatchY = Math.floor(i / 4) * (swatchHeight + 1) + margin.top;
                    } else {
                        swatchX = (width - margin.left - margin.right) / 6 * rowPosition + margin.left;
                        swatchY = Math.floor(i / 6) * (swatchHeight + 1) + margin.top;
                    }
                    let textX = swatchX + swatchWidth + 5;
                    let textY = swatchY + swatchHeight - 3;

                    // Append the group element to the SVG element.
                    let g = svg.append("g");
                    // languageColorsArray[i].color
                    // Append a swatch to the group element.
                    g.append("rect")
                        .attr("width", swatchWidth)
                        .attr("height", swatchHeight)
                        .attr("fill", (d: any) => {
                            const color = d3.rgb(languageColorsArray[i].color).toString();
                            const rgbaColor = color.replace(')', ', 0.8)')
                            return rgbaColor;
                        })
                        .attr("x", swatchX)
                        .attr("y", swatchY);

                    // Append a text label to the group element.
                    g.append("text")
                        .attr("x", textX)
                        .attr("y", textY)
                        .text(languageColorsArray[i].language)
                        .style("font-size", `${12 / baseFontSize}rem`)
                        .style("font-family", "Arial");
                }
            }
        }, [results, areaChartSvgRef, windowSize]);

        // Return the SVG element with the specified dimensions.
        if (hasData) {
            const numLanguages = languageColorsArray.length;
            let numRows: number;
            if (windowSize.width < 300) {
                numRows = Math.ceil(numLanguages / 2);
            }
            else if (windowSize.width < 900) {
                numRows = Math.ceil(numLanguages / 4);
            } else {
                numRows = Math.ceil(numLanguages / 6);
            }
            const legendHeight = numRows * (15 + 1) + 10;

            return <svg ref={swatchLegendSvgRef} width={Math.min(windowSize.width, 1200)} height={legendHeight} />;
        }
        else return <p>There is not enough data available to visualize the chart. Please try again later.</p>
    }

    // Define a function that creates a cumulative stacked area chart using D3.js.
    function CumulativeStackedAreaChart(): JSX.Element {
        // Check if the required data is available.
        const hasData = results && results.length === commitData.length && results.filter((item) => item !== null).length > 1;

        // Use the useEffect hook to execute code after the component is mounted or updated.
        useEffect(() => {
            // Check if the SVG element and the required data are available.
            if (hasData) {
                // Remove any null values from the results array.
                const resultsWithoutNull = results.filter((item) => item !== null).sort((a, b) => a.date - b.date);
                
                // Select the SVG element using D3.js.
                const svg = d3.select(areaChartSvgRef.current);

                // Clear the SVG by removing all existing elements.
                svg.selectAll('*').remove();

                // Set the base font size.
                const baseFontSize = 16; // in pixels

                // Find the string of the highest y-axis value.
                let totalCommits = Math.round(resultsWithoutNull.length);

                // Generate a temporary text element in the DOM.
                let temporaryTextElement;
                if (windowSize.width < 400) {
                    temporaryTextElement = svg.append("text")
                    .text(totalCommits)
                    .style("font-size", `${10 / baseFontSize}rem`)
                    .style("font-family", "Arial");
                } else {
                    temporaryTextElement = svg.append("text")
                    .text(totalCommits)
                    .style("font-size", `${12 / baseFontSize}rem`)
                    .style("font-family", "Arial");
                };

                // Calculate the longest repo width based on the computed text
                const longestYAxisValue = temporaryTextElement.node()?.getComputedTextLength();

                // Remove the temporary text element from the DOM.
                temporaryTextElement.remove();

                // Define the dimensions of the chart and its margins.
                const height = Math.min(windowSize.width / 2, 600);
                const width = Math.min(windowSize.width, 1200);
                let margin: {top: number, right: number, bottom: number, left: number};
                if (windowSize.width < 1200) {
                    margin = {top: 6, right: 10, bottom: 36, left: (longestYAxisValue || 10) + 19};
                } else {
                    margin = {top: 6, right: 0, bottom: 21, left: (longestYAxisValue || 10) + 9};
                }

                // Determine the earliest and latest dates in the results array.
                const earliestDate: Date = resultsWithoutNull.reduce((min: Date, d: { language: string, color: string, date: Date }) => d.date < min ? d.date : min, resultsWithoutNull[0].date);
                const latestDate: Date = resultsWithoutNull.reduce((max: Date, d: { language: string, color: string, date: Date }) => d.date > max ? d.date : max, resultsWithoutNull[0].date);

                // Create a scale for the x-axis.
                const x = d3.scaleTime()
                    .domain([earliestDate, latestDate])
                    .range([margin.left, width - margin.right]);

                // Define the x-axis with tick lines, guidelines, and no axis line.
                const xAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) => g
                    .call(d3.axisBottom(x));

                // Create a scale for the y-axis.
                const y = d3.scaleLinear()
                    .domain([0, Math.round(resultsWithoutNull.length)])
                    .range([height - margin.bottom,  margin.top])

                // Define the y-axis with tick lines, guidelines, and no axis line.
                const yAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) => g
                    .attr("transform", `translate(${margin.left},0)`)
                    .call(d3.axisLeft(y))
                    .call(g => g.selectAll(".tick line").clone().attr("stroke-opacity", 0.1).attr("x2", width - margin.right - margin.left))
                    .call(g => g.selectAll(".domain").remove());

                // Create a lanugage set to store unique "language" values
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
                const stackedData = stack(resultsWithoutNull)

                // Create a color map to map the language to a color for the colorScale.
                const colorMap = resultsWithoutNull.reduce((acc, curr) => {
                    if (!(curr.language in acc)) {
                      acc[curr.language] = curr.color;
                    }
                    return acc;
                }, {});

                const colorScale: any = d3.scaleOrdinal()
                    .domain(stackedData.map(d => d.key))
                    .range(stackedData.map(d => colorMap[d.key]))

                // Create an area generator using D3.js.
                const area = d3.area()
                    .x((d: any) => x(d.data.date))
                    .y0((d: any) => y(d[0]))
                    .y1((d: any) => y(d[1]));

                // Add the x-axis to the chart.
                if (windowSize.width < 700) {
                    svg.append('g')
                        .attr('transform', `translate(0,${height - margin.bottom})`)
                        .call(xAxis)
                        .selectAll('text')
                        .style('text-anchor', 'end')
                        .attr('transform', 'rotate(-45)')
                        .attr('dx', '-.8em')
                        .attr('dy', '.15em');
                } else {
                    svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(xAxis);
                }

                // Add the y-axis to the chart.
                svg.append('g').attr('transform', `translate(${margin.left},0)`).call(yAxis);

                // Add the stacked areas to the chart.
                svg.append("g")
                    .selectAll("path")
                    .data(stackedData)
                    .join("path")
                        .attr("fill", (d: any) => {
                            const color = d3.rgb(colorScale(d.key)).toString()
                            const rgbaColor = color.replace(')', ', 0.8)')
                            return rgbaColor
                        })
                        .attr("d", area as any)
                    .append("title")
                        .text(d => d.key);

                // Set text font size.
                if (windowSize.width < 400) {
                    svg.selectAll("text")
                        .style("font-size", `${10 / baseFontSize}rem`)
                        .style("font-family", "Arial");
                } else {
                    svg.selectAll("text")
                        .style("font-size", `${12 / baseFontSize}rem`)
                        .style("font-family", "Arial");
                };
            }
        }, [results, areaChartSvgRef, windowSize]);

        // Return the SVG element with the specified dimensions.
        if (hasData) return <svg ref={areaChartSvgRef} width={Math.min(windowSize.width, 1200)} height={Math.min(windowSize.width / 2, 600)} />;
        if (!hasData) return <p>There is not enough data available to visualize the chart. Please try again later.</p>
        return <p>There is not enough data available to visualize the chart. Please try again later.</p>
    }

    // Define a function that creates a cumulative stacked area chart using D3.js.
    function PieChart(): JSX.Element {
        // Use the useEffect hook to execute code after the component is mounted or updated.
        useEffect(() => {
            // Check if the SVG element and the required data are available.
            if (hasData) {
                // Remove any null values from the results array.
                const resultsWithoutNull = results.filter((item) => item !== null).sort((a, b) => a.date - b.date);

                // Create a lanugage set to store unique "language" values
                const languageSet: Set<string> = new Set();
                resultsWithoutNull.map((commit) => {languageSet.add(commit.language)});

                // Create a pie chart data array.
                const pieChartData: Array<{name: string, value: number, color: string}> = Array.from(languageSet).map((language: string) => {
                    let color: string = "";
                    const count = resultsWithoutNull.reduce((acc, obj) => {
                      if (obj.language === language) {
                        color = obj.color;
                        return acc + 1;
                      }
                      return acc;
                    }, 0);
                    
                    return { name: language, value: count, color: color };
                });
                
                // Select the SVG element using D3.js.
                const svg = d3.select(pieChartSvgRef.current);

                // Clear the SVG by removing all existing elements.
                svg.selectAll('*').remove();

                // Define the dimensions of the chart and its margins.
                const height = Math.min(windowSize.width / 2, 600);
                const width = Math.min(windowSize.width, 1200);

                // Define the radius of the chart.
                const padAngle = 0;
                const radius = Math.min(width, height) / 2;

                interface MyArcData {
                    startAngle: number;
                    endAngle: number;
                    padAngle: number;
                    innerRadius: number;
                    outerRadius: number;
                }

                // Define the arc generators.
                const arc = d3.arc<MyArcData>()
                    .innerRadius(0)
                    .outerRadius(radius - 1);

                // Define the pie generator.
                const pie = d3.pie<{ name: string; value: number; color: string }>()
                    .padAngle(padAngle)
                    .sort((a, b) => d3.descending(a.value, b.value))
                    .value(d => d.value);

                // Define the color scale.
                const color = d3.scaleOrdinal<string>()
                    .domain(pieChartData.map(d => d.name))
                    .range(pieChartData.map(d => {
                        const hexCode = d.color.replace('#', ''); // Remove the '#' if present
                        const red = parseInt(hexCode.substring(0, 2), 16); // Extract the red value
                        const green = parseInt(hexCode.substring(2, 4), 16); // Extract the green value
                        const blue = parseInt(hexCode.substring(4, 6), 16); // Extract the blue value
                    
                        return `rgba(${red}, ${green}, ${blue}, 0.8)`;
                      }));

                // Add the chart to the SVG element.
                svg.selectAll("path")
                    .data(pie(pieChartData))
                    .join("path")
                        .attr("fill", d => color(d.data.name))
                        .attr("d", d => arc({
                            ...d,
                            innerRadius: 0,
                            outerRadius: radius - 1
                        }))
                    .attr("transform", `translate(${width / 2}, ${height / 2})`)
                    .append("title")
                        .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);
            }
        }, [results, pieChartSvgRef, windowSize]);

        // Return the SVG element with the specified dimensions.
        if (hasData) return <svg ref={pieChartSvgRef} width={Math.min(windowSize.width, 1200)} height={Math.min(windowSize.width / 2, 600)} />;
        if (!hasData) return <p>There is not enough data available to visualize the chart. Please try again later.</p>
        return <p>There is not enough data available to visualize the chart. Please try again later.</p>
    }
    
    // Return the component JSX
    return (
        <section id={styles.languages} style={hasData ? {display: "flex"} : {display: "none"}}>
            <div id={styles.intro}>
                <h1 id={styles.title}>Languages</h1>
                <small id={styles.options}>
                    <button className={styles.option} style={currentChart == "CumulativeStackedAreaChart" ? {color: "#104d93"} : {color: "#595959"}} onClick={() => setCurrentChart("CumulativeStackedAreaChart")}>Area chart</button> 
                    {" "}/{" "}
                    <button className={styles.option} style={currentChart == "CumulativeStackedAreaChart" ? {color: "#595959"} : {color: "#104d93"}} onClick={() => setCurrentChart("PieChart")}>Pie chart</button>
                </small>
                <Image 
                    id={styles.download}
                    src="/icons/download.svg" 
                    onClick={() => {currentChart == "CumulativeStackedAreaChart" ? handleDownload(areaChartSvgRef) : handleDownload(pieChartSvgRef)}} 
                    height={20} 
                    width={20} 
                    alt="Download" 
                />
            </div>
            <div>
                {SwatchLegend()}
            </div>
            <>
                {currentChart == "CumulativeStackedAreaChart" ? CumulativeStackedAreaChart() : PieChart()}
            </>
        </section>
    )
}