import { useEffect, useRef } from "react";
import * as d3 from "d3";

// Define types/interfaces
interface Props {
    height: number;
    width: number;
}

export default function Logo(props: Props): JSX.Element {
    // Destructure props into height and width.
    const { height, width } = props;

    // Create a reference to the SVG element that will be rendered.
    const svgRef = useRef<SVGSVGElement>(null);

    // Use the useEffect hook to execute code after the component is mounted or updated.
    useEffect(() => {
        // Select the SVG element using D3.js.
        const svg = d3.select(svgRef.current);

        // Clear the SVG by removing all existing elements.
        svg.selectAll('*').remove();

        // Define the radius of the circle.
        const radius = Math.min(width, height) / 2;
        const innerRadius = radius * 0.6;

        interface MyArcData {
            startAngle: number;
            endAngle: number;
            padAngle: number;
            innerRadius: number;
            outerRadius: number;
        }

        const ringArc = d3.arc<MyArcData>()
            .innerRadius(innerRadius)
            .outerRadius(radius - 1);

        // Create a single arc with a fixed value of 1.
        const ringData = [1];

        // Append a <g> element to hold the ring.
        const ringG = svg.append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        // Draw the arc.
        ringG.selectAll("path")
            .data(ringData)
            .enter().append("path")
            .attr("d", d => ringArc({
                startAngle: 0,
                endAngle: Math.PI * 2,
                padAngle: 0,
                innerRadius: 0,
                outerRadius: radius - 1
            }))
            .attr("fill", "#1565c0");

        // Create a single arc with the desired start and end angles.
        const arcData = [{ startAngle: 2 * Math.PI * 0.375 - 0.2, endAngle: 2 * Math.PI * 0.375 + 0.2 }];

        // Define a second arc.
        const arc = d3.arc<MyArcData>()
            .innerRadius(0)
            .outerRadius(radius + 4);

        const arcG = svg.append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        arcG.selectAll("path")
            .data(arcData)
            .enter().append("path")
            .attr("d", d => arc({
                startAngle: d.startAngle,
                endAngle: d.endAngle,
                padAngle: 0,
                innerRadius: 0,
                outerRadius: radius - 1
            }))
            .attr("fill", "#f0f0f0");

        // Define the line coordinates.
        const lineData = [
            [0, height],   // Bottom left point
            [width, 0]     // Top right point
        ];
  
        // Create a line generator.
        const line = d3.line<[number, number]>()
            .x(d => d[0])
            .y(d => d[1]);
  
        // Append a <path> element representing the line.
        svg.append('path')
            .attr('d', line(lineData as [number, number][]))
            .attr('stroke', '#ffffff')
            .attr('stroke-width', height / 3)
            .attr('fill', 'none')
            .style('mix-blend-mode', 'difference');
            
    }, [height, width]);

    return <svg ref={svgRef} width={width} height={height} />;
}