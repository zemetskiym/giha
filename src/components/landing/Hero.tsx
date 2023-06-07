import styles from "@/styles/components/landing/Hero.module.css"
import { useWindowSizeContext } from '@/components/context';
import { useRef, useEffect } from "react";
import * as d3 from "d3";

// Defining the Search interface.
interface Search {
    user: string, 
    submit: boolean
}

// Defining the Props interface, which takes in Search and setSearch functions.
interface Props {
    search: Search,
    setSearch: React.Dispatch<React.SetStateAction<Search>>,
    numCommits: number,
    setNumCommits: React.Dispatch<React.SetStateAction<number>>
}

// Defining the Hero component, which takes in Props and returns a JSX element.
export default function Hero (props: Props): JSX.Element {
    // Import the window size context.
    const windowSize = useWindowSizeContext();

    // Destructure the props object into React state.
    const { search, setSearch, numCommits, setNumCommits } = props;

    // Defining a function to handle form submissions.
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSearch((prev) => ({user: prev.user, submit: true}))
    }

    // Create a function to render a d3.js globe.
    function RenderGlobe(): JSX.Element {
        // Create a reference to the SVG element that will be rendered.
        const svgRef = useRef<SVGSVGElement>(null);

        // Use the useEffect hook to execute code after the component is mounted or updated.
        useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await fetch('/world.json');
                    const geojson = await response.json();

                    // Generate random points on the sphere
                    const numPoints = 10;
                    const randomPoints = [];

                    for (let i = 0; i < numPoints; i++) {
                    const randomLongitude = Math.random() * 360 - 180;
                    const randomLatitude = Math.random() * 180 - 90;

                    randomPoints.push({
                        type: "Feature",
                        properties: {
                            name: "Random Point " + i
                        },
                        geometry: {
                            type: "Point",
                            coordinates: [randomLongitude, randomLatitude]
                        }
                    });
                    }

                    // Append randomPoints to geojson
                    geojson.features = geojson.features.concat(randomPoints);
            
                    // Select the SVG element and remove any existing elements.
                    const svg = d3.select(svgRef.current);
                    svg.selectAll('*').remove();
            
                    // Set the height and width of the SVG.
                    const height = Math.min(windowSize.width, 600);
                    const width = Math.min(windowSize.width, 600);
                    const sensitivity = 75;

                    // Define the projection for the globe.
                    let projection = d3.geoOrthographic()
                        .scale(250)
                        .center([0, 0])
                        .rotate([0,-30])
                        .translate([width / 2, height / 2]);

                    let path: any = d3.geoPath().projection(projection);

                    // Append a circle representing the globe to the SVG.
                    let globe = svg.append("circle")
                        .attr("fill", "#EEE")
                        .attr("stroke", "#000")
                        .attr("stroke-width", "0.2")
                        .attr("cx", width/2)
                        .attr("cy", height/2)
                        .attr("r", projection.scale());

                    let map = svg.append("g")

                    // Append the country paths to the map.
                    map.append("g")
                        .attr("class", "countries" )
                        .selectAll("path")
                        .data(geojson.features)
                        .enter().append("path")
                        .attr("class", (d: any) => "country_" + d.properties.name.replace(" ","_"))
                        .attr("d", path)
                        .style("fill", (d: any) => {
                            if (d.geometry.type === "Point") {
                              return "steelblue"; // Set the color for points
                            } else {
                              return "white"; // Set the color for other shapes
                            }
                          })
                        .style('stroke', 'black')
                        .style('stroke-width', 0.3)
                        .style("opacity",0.8)

                    // Generate the latitude and longitude lines using d3.geoGraticule().
                    const graticuleGenerator = d3.geoGraticule();

                    // Append the graticule path to the map.
                    map.append("path")
                        .datum(graticuleGenerator)
                        .attr("class", "graticule")
                        .attr("d", path)
                        .style("fill", "none")
                        .style("stroke", "#ccc")
                        .style("stroke-width", 0.4);

                    // Update the rotation of the globe and paths every 200 milliseconds.
                    d3.timer(function() {
                        const rotate = projection.rotate()
                        const k = sensitivity / projection.scale()
                        projection.rotate([
                          rotate[0] - 1 * k,
                          rotate[1]
                        ])
                        path = d3.geoPath().projection(projection)
                        svg.selectAll("path").attr("d", path)
                    },200)
                } catch (error) {
                    console.error('Error fetching GeoJSON:', error);
                };
            };
            
            fetchData(); // Invoke the fetchData function to fetch the data
        }, [windowSize]);

        return <svg ref={svgRef} width={Math.min(windowSize.width, 600)} height={Math.min(windowSize.width, 600)} />;
    };

    // Returning the JSX element, which displays a search input and submit button.
    return (
        <section>
            <div>
                {RenderGlobe()}
            </div>
            <form onSubmit={event => handleSubmit(event)}>
                <input 
                    type="text" 
                    onChange={event => setSearch(({user: event.target.value, submit: false}))}
                    value={search.user}
                    placeholder="Search for user..."
                />
                <select value={numCommits} onChange={event => setNumCommits(+event.target.value)}>
                    <option value={3}>3 Commits</option>
                    <option value={10}>10 Commits</option>
                    <option value={20}>20 Commits</option>
                </select>
                <button>Submit</button>
            </form>
        </section>
    )
}