import styles from "@/styles/components/FunFacts.module.css";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useWindowSizeContext } from '@/components/context';
import Image from "next/image";

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
    // Import the window size context
    const windowSize = useWindowSizeContext();

    // Destructure the props object
    const {commitData = []} = props;
    const filteredCommitData = commitData.filter(Boolean) as Array<Commit>;

    // Create a reference to the SVG elements that will be rendered.
    const timeOfWeekSvgRef = useRef<SVGSVGElement>(null);
    const LOCSvgRef = useRef<SVGSVGElement>(null);

    // Check if the required commit data is available.
    const hasData = filteredCommitData.length > 0;

    type Convention = 'camelCase' | 'snakeCase' | 'pascalCase' | 'kebabCase';

    // Function to find the object with the highest value property
    function findMaxProperty (object: object): {prop: string, value: number} {
        return Object.entries(object).reduce((prev, [prop, value]) => {
            if (value > prev.value) {
              return { prop, value };
            }
            return prev;
        }, { prop: '', value: -Infinity });
    }

    // Function to count the occurrences of programming conventions
    function countProgrammingConventions(filteredCommitData: Array<Commit>): string {
        // Initialize count object
        let count: Record<Convention, number> = {camelCase: 0, snakeCase: 0, pascalCase: 0, kebabCase: 0};

        // Regular expressions for different conventions
        const regexes = {
            camelCase: /[a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]*/g,
            snakeCase: /\b[a-z][a-zA-Z0-9]*_[a-z][a-zA-Z0-9]*\b/g,
            pascalCase: /[A-Z]([A-Z0-9]*[a-z][a-z0-9]*[A-Z]|[a-z0-9]*[A-Z][A-Z0-9]*[a-z])[A-Za-z0-9]*/g,
            kebabCase: /\b[a-z][a-zA-Z0-9]*-[a-z][a-zA-Z0-9]*\b/g,
        };
        
        // Function to count matches for a given regex
        function countMatches(regex: RegExp, diff: string) {
            return (diff.match(regex) || []).length;
        };
        
        // Iterate over filtered commit data
        for (let commit of filteredCommitData) {
            const patch = commit.files[0].patch;

            // Skip to the next iteration if patch is undefined
            if (typeof patch === "undefined") {
                continue;
            }

            // Count matches for each convention
            for (let convention in regexes) {
                count[convention as Convention] += countMatches(regexes[convention as Convention], patch);
            };
        };

        // Find the convention with the highest count
        const highestCount = findMaxProperty(count).prop
        
        // Return the most-used programming convention
        if (highestCount == "camelCase") return "camelCase";
        if (highestCount == "snakeCase") return "snake_case";
        if (highestCount == "pascalCase") return "PascalCase";
        if (highestCount == "kebabCase") return "kebab-case";
        return "camelCase"; // Default convention
    };

    // Function to count the average LOC per commit
    function findAvgLOC(filteredCommitData: Array<Commit>): number {
        let sum = 0;
        for (let commit of filteredCommitData) {
            // Checking if commit has files, at least one file, and patch is a string
            if (commit.files && commit.files.length > 0 && typeof commit.files[0].patch === "string") {
                sum += commit.files[0].patch.split("\n").length;
            }
        };
        return sum / filteredCommitData.length;
    };

    // Function to return the day of the week with the most commits
    enum ReturnType {
        Day = 'day',
        Count = 'count'
    };
    function findMostProductiveDayOfWeek(filteredCommitData: Array<Commit>, returnType: ReturnType = ReturnType.Day): string | Record<string, number> {
        // Initialize count object
        let count: Record<string, number> = {Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0};

        // Iterate over filtered commit data
        for (let commit of filteredCommitData) {
            const date = new Date(commit.commit.author.date);
            const day = date.getDay();
            count[Object.keys(count)[day]] += 1;
        };

        if (returnType === ReturnType.Count) return count;
        
        // Return the most productive day of the week
        return findMaxProperty(count).prop;
    };

    // Function to find the most productive time of day
    function findMostProductiveTimeOfDay(filteredCommitData: Array<Commit>): string {
        // Initialize count object
        let count: Record<string, number> = {morning: 0, afternoon: 0, evening: 0, night: 0};

        // Iterate over filtered commit data
        for (let commit of filteredCommitData) {
            const date = new Date(commit.commit.author.date);
            const hour = date.getHours();
            if (hour < 12) count.morning += 1;
            else if (hour < 17) count.afternoon += 1;
            else if (hour < 20) count.evening += 1;
            else count.night += 1;
        };
        
        // Return the most productive time of day
        return findMaxProperty(count).prop;
    };

    // D3.js line graph for the number of commits over the time of week
    function TimeOfWeekLineGraph(): JSX.Element {
        useEffect(() => {
            // Select the SVG element using D3.js.
            const svg = d3.select(timeOfWeekSvgRef.current);

            // Clear the SVG by removing all existing elements.
            svg.selectAll('*').remove();

            // Define a variable to hold the data points.
            const weekData = Object.entries(findMostProductiveDayOfWeek(filteredCommitData, ReturnType.Count)).map(([key, value]) => ({ key: key.slice(0, 3), value }));

            // Define the dimensions of the chart and its margins.
            const height = Math.min(windowSize.width * 0.9, 595);
            const width = Math.min(windowSize.width * 0.9, 595);
            const margin = {top: 20, right: 20, bottom: 42, left: 20};

            // Define the halo color and width.
            const halo = "#f5f5f5";
            const haloWidth = 6;

            // Define the x-axis scale.
            const xScale = d3.scaleBand()
                .domain(weekData.map(d => d.key.slice(0, 3)))
                .rangeRound([margin.left, width - margin.right])
                .padding(0.1);

            // Define the x-axis with tick lines and no axis line.
            const xAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) => g
                .call(d3.axisBottom(xScale));

            // Create the y scale using scaleLinear.
            const yScale = d3.scaleLinear()
                .domain([d3.min(weekData, d => d.value), d3.max(weekData, d => d.value)])
                .range([height - margin.bottom,  margin.top]);

            // Create the line generator.
            const line = d3.line<{ key: string; value: number }>()
                .x((d) => xScale(d.key)! + xScale.bandwidth() / 2)
                .y((d) => yScale(d.value)!);

            svg.append("path")
                .attr("d", line(weekData))
                .attr("stroke", "#1565c0")
                .attr("stroke-width", 2)
                .attr("fill", "none");

            // Add the x-axis to the chart.
            if (windowSize.width < 800) {
                svg.append('g')
                .attr('transform', `translate(0,${height - margin.bottom})`)
                .call(xAxis)
                .selectAll('text')
                .style('text-anchor', 'end')
                .attr('transform', 'rotate(-45)')
                .attr('dx', '-.8em')
                .attr('dy', '.15em');
            } else {
                svg.append('g')
                .attr('transform', `translate(0,${height - margin.bottom})`)
                .call(xAxis);
            }  

            // Add the inline labels to the chart.
            svg.append("g")
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .attr("text-anchor", "middle")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .selectAll("text")
                .data(weekData)
                .join("text")
                .attr("dy", "0.35em")
                .attr("x", (d) => xScale(d.key)! + xScale.bandwidth() / 2)
                .attr("y", (d) => yScale(d.value) - 10) // Adjust the y-coordinate for label placement
                .text((d) => d.value)
                .call(text => text
                    .filter((_, j, I) => j === I.length - 1)
                    .append("tspan")
                      .attr("font-weight", "bold")
                      .text(" Commits"))
                .call(text => text.clone(true))
                .attr("fill", "none")
                .attr("stroke", halo)
                .attr("stroke-width", haloWidth);

            // Set the base font size.
            const baseFontSize = 16; // in pixels

            // Set text font size.
            if (windowSize.width < 400) {
                svg.selectAll("text")
                    .style("font-size", `${10 / baseFontSize}rem`);
            } else {
                svg.selectAll("text")
                    .style("font-size", `${12 / baseFontSize}rem`);
            };
        }, [timeOfWeekSvgRef, windowSize]);

        if (!hasData) {
            return <p>There is not enough data available to visualize the chart. Please try again later.</p>;
        }
        return <svg ref={timeOfWeekSvgRef} width={Math.min(windowSize.width * 0.9, 595)} height={Math.min(windowSize.width * 0.9, 595)} />;
    }

    function findRange(filteredCommitData: Array<Commit>) {
        // Array of range objects with their corresponding min and max values
        const ranges = [
          { range: "0-10", min: 0, max: 10, amount: 0 },
          { range: "11-30", min: 11, max: 30, amount: 0 },
          { range: "31-50", min: 31, max: 50, amount: 0 },
          { range: "51-100", min: 51, max: 100, amount: 0 },
          { range: "101-200", min: 101, max: 200, amount: 0 },
          { range: "201-500", min: 201, max: 500, amount: 0 },
          { range: "500+", min: 501, max: Infinity, amount: 0 },
        ];
      
        // Iterate over the commits
        for (let commit in filteredCommitData) {
            let number: number;
            try {
                number = filteredCommitData[commit].files[0].patch.split("\n").length;
            } catch (error) {
                continue; // Skip to the next iteration if there was an error
            }
            // Iterate over the ranges to find the matching range for the given number
            for (const rangeObj of ranges) {
                // Check if the number falls within the min and max values of the range
                if (number >= rangeObj.min && number <= rangeObj.max) {
                rangeObj.amount++; // Increment the amount of commits in the range
                };
            };
        };

        // Return the ranges with their corresponding amounts
        return ranges.map(({ range, amount }) => ({ range, amount }));
    }

    function LOCBarChart(): JSX.Element {
        useEffect(() => {
            // Select the SVG element using D3.js.
            const svg = d3.select(LOCSvgRef.current);

            // Clear the SVG by removing all existing elements.
            svg.selectAll('*').remove();

            const LOCData = findRange(filteredCommitData);

            // Define the dimensions of the chart and its margins.
            const height = Math.min(windowSize.width * 0.9, 595);
            const width = Math.min(windowSize.width * 0.9, 595);
            const margin = {top: 20, right: 20, bottom: 42, left: 20};

            // Define the halo color and width.
            const halo = "#f5f5f5";
            const haloWidth = 6;

            // Define the x-axis scale.
            const xScale = d3.scaleBand()
                .domain(["0-10", "11-30", "31-50", "51-100", "101-200", "201-500", "500+"])
                .rangeRound([margin.left, width - margin.right])
                .padding(0.1);

            // Define the x-axis with tick lines and no axis line.
            const xAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) => g
                .call(d3.axisBottom(xScale));

            // Define the y-axis scale.
            const yScale = d3.scaleLinear()
                .domain([0, d3.max(LOCData, (d) => d.amount)!])
                .rangeRound([height - margin.bottom, margin.top]);

            // Add a rect for each bar.
            svg.append("g")
                .attr("fill", "#1565c0")
                .selectAll()
                .data(LOCData)
                .join("rect")
                .attr("x", (d) => xScale(d.range)!)
                .attr("y", (d) => yScale(d.amount))
                .attr("height", (d) => yScale(0) - yScale(d.amount))
                .attr("width", xScale.bandwidth());

            // Add the x-axis to the chart.
            if (windowSize.width < 800) {
                svg.append('g')
                .attr('transform', `translate(0,${height - margin.bottom})`)
                .call(xAxis)
                .selectAll('text')
                .style('text-anchor', 'end')
                .attr('transform', 'rotate(-45)')
                .attr('dx', '-.8em')
                .attr('dy', '.15em');
            } else {
                svg.append('g')
                .attr('transform', `translate(0,${height - margin.bottom})`)
                .call(xAxis);
            };

            // Add the inline labels to the chart.
            svg.append("g")
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .attr("text-anchor", "middle")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .selectAll("text")
                .data(LOCData)
                .join("text")
                .attr("dy", "0.35em")
                .attr("x", (d) => xScale(d.range)! + xScale.bandwidth() / 2)
                .attr("y", (d) => yScale(d.amount) - 10) // Adjust the y-coordinate for label placement
                .text((d) => d.amount)
                .call(text => text
                    .filter((_, j, I) => j === I.length - 1)
                    .append("tspan")
                      .attr("font-weight", "bold")
                      .text(" Commits"))
                .call(text => text.clone(true))
                .attr("fill", "none")
                .attr("stroke", halo)
                .attr("stroke-width", haloWidth);

            // Set the base font size.
            const baseFontSize = 16; // in pixels

            // Set text font size.
            if (windowSize.width < 400) {
                svg.selectAll("text")
                    .style("font-size", `${10 / baseFontSize}rem`);
            } else {
                svg.selectAll("text")
                    .style("font-size", `${12 / baseFontSize}rem`);
            };
        }, [LOCSvgRef, windowSize])

        if (!hasData) {
            return <p>There is not enough data available to visualize the chart. Please try again later.</p>;
        }
        return <svg ref={LOCSvgRef} width={Math.min(windowSize.width* 0.9, 595)} height={Math.min(windowSize.width * 0.9, 595)} />
    }

    function handleDownload(svgRef: React.RefObject<SVGSVGElement>) {
        // Get the SVG element
        const svgElement = svgRef.current;

        if (svgElement != null) {
            // Convert the SVG element to a Blob
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const blob = new Blob([svgData], { type: "image/svg+xml" });

            // Create a URL for the Blob
            const url = URL.createObjectURL(blob);

            // Create a temporary link element and click it programmatically to trigger the download
            const link = document.createElement("a");
            link.href = url;
            if (svgRef == timeOfWeekSvgRef) {
                link.download = "commits-over-day-of-week.svg";
            } else if (svgRef == LOCSvgRef)  {
                link.download = "commits-over-LOC.svg";
            }
            link.click();

            // Clean up the URL and remove the temporary link element
            URL.revokeObjectURL(url);
        }
    }

    return (
        <section id={styles.funFacts} style={hasData ? {display: "flex"} : {display: "none"}}>
            <div id={styles.intro}>
                <h1 id={styles.title}>Fun Facts</h1>
            </div>
            <div className={styles.facts}>I average {findAvgLOC(filteredCommitData).toFixed(2)} lines of code (LOC) per commit</div>
            <div className={styles.facts}>I consistently follow the <code>{countProgrammingConventions(filteredCommitData)}</code> programming convention</div>
            <div className={styles.facts}>My most productive days are {findMostProductiveDayOfWeek(filteredCommitData) as string}s</div>
            <div className={styles.facts}>I commit my code in {findMostProductiveTimeOfDay(filteredCommitData)}s</div>
            <div id={styles.graphs}>
                <span className={styles.graph}>
                    <div className={styles.downloadContainer}>
                        <Image className={styles.download} src="/icons/download.svg" onClick={() => handleDownload(timeOfWeekSvgRef)} height={20} width={20} alt="Download" />
                    </div>
                    <div>
                        {TimeOfWeekLineGraph()}
                    </div>
                    <div className={styles.label}>Time of Week (TOW)</div>
                </span>
                <span className={styles.graph}>
                    <div className={styles.downloadContainer}>
                        <Image className={styles.download} src="/icons/download.svg" onClick={() => handleDownload(LOCSvgRef)} height={20} width={20} alt="Download" />
                    </div>
                    <div>
                        {LOCBarChart()}
                    </div>
                    <div className={styles.label}>Lines of Code (LOC)</div>
                </span>
            </div>
        </section>
    );
};