import styles from "@/styles/components/landing/Hero.module.css"
import { useWindowSizeContext } from '@/components/context';
import { useRef, useEffect } from "react";
import * as d3 from "d3";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";

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

    // Set state for the authentication popup.
    const [showPopup, setShowPopup] = useState(false);

    // Retrieving the user's NextAuth.js session data.
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    // Defining a function to handle form submissions.
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (search.user.length > 0) {
            setSearch((prev) => ({user: prev.user, submit: true}))
        }
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
                        let pointFound = false;
                        let randomLongitude: number = 0;
                        let randomLatitude: number = 0;
                      
                        while (!pointFound) {
                          randomLongitude = Math.random() * 360 - 180;
                          randomLatitude = Math.random() * 180 - 90;
                      
                          // Check if the random point falls within any country polygon
                          const isInsideCountry: boolean = geojson.features.some((feature: GeoJSON.Feature ) => {
                            if (feature.geometry.type === "Polygon") {
                              return d3.geoContains(feature, [randomLongitude, randomLatitude]);
                            }
                            return false;
                          });
                      
                          if (isInsideCountry) {
                            pointFound = true;
                          }
                        }

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
                    const height = 600;
                    const width = windowSize.width;
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
                        .attr("fill", "#f5f5f5")
                        .attr("stroke", "#bdbdbd")
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
                        .style("fill", "#dddddd")
                        .style("stroke", (d: any) => {
                            if (d.geometry.type === "Point") {
                              return "#b3b3b3"; // Set the color for points
                            } else {
                              return "#bdbdbd"; // Set the color for other shapes
                            }
                          })
                        .style("stroke-width", (d: any) => {
                            if (d.geometry.type === "Point") {
                              return 3; // Set the color for points
                            } else {
                              return 0.3; // Set the color for other shapes
                            }
                          })
                        .style("opacity",0.8)

                    // Generate the latitude and longitude lines using d3.geoGraticule().
                    const graticuleGenerator = d3.geoGraticule();

                    // Append the graticule path to the map.
                    map.append("path")
                        .datum(graticuleGenerator)
                        .attr("class", "graticule")
                        .attr("d", path)
                        .style("fill", "none")
                        .style("stroke", "#bdbdbd")
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

        return <svg ref={svgRef} width={windowSize.width} height={600} />;
    };

    const AuthenticationPopup = () => (
        <div id={styles.popup} onClick={() => setShowPopup(false)}>
            By connecting with GitHub, you&apos;ll have access to more commits and a richer analysis experience.
        </div>
    );

    // Returning the JSX element, which displays a search input and submit button.
    return (
        <section id={styles.hero}>
            <div id={styles.globe}>
                {RenderGlobe()}
            </div>
            <div id={styles.intro}>
                <Image id={styles.unlock} src="/icons/unlock.svg" width={40} height={40} alt="" />
                <div>
                    <h1 id={styles.title}>Unlock the coding universe on GitHub</h1>
                    <h2 id={styles.subtitle}>Analyze user profiles, track coding patterns, and explore global collaboration</h2>
                </div>
            </div>
            <form onSubmit={event => handleSubmit(event)} id={styles.form}>
                <h2 id={styles.getStarted}>Get started</h2>
                {showPopup && <AuthenticationPopup />}
                {!session && 
                    <div id={styles.signInContainer}>
                        <button id={styles.signIn} type="button" onClick={() => signIn("github")}>
                            <Image id={styles.githubIcon} src="/icons/github.svg" width={20} height={20} alt="" />
                            <span>Sign in with GitHub</span>
                        </button>
                        <button id={styles.help} onClick={() => setShowPopup(prev => !prev)}>?</button>
                    </div>
                }
                <div id={styles.searchContainer}>
                    <input 
                        id={styles.search}
                        type="text" 
                        onChange={event => setSearch(({user: event.target.value, submit: false}))}
                        value={search.user}
                        placeholder="Github Username*"
                    />
                    <select id={styles.select} value={numCommits} onChange={event => setNumCommits(+event.target.value)}>
                        <option value={20}>20 Commits</option>
                        <option value={40}>40 Commits</option>
                        {session && accessToken && <option value={100}>100 Commits</option>}
                        {session && accessToken && <option value={200}>200 Commits</option>}
                        {session && accessToken && <option value={500}>500 Commits</option>}
                    </select>
                </div>
                <button style={search.user.length > 0 ? {backgroundColor: '#1565c0', cursor: 'pointer'} : {backgroundColor: '#3b4d61', cursor: 'not-allowed'}} id={styles.submit}>Submit</button>
            </form>
        </section>
    )
}