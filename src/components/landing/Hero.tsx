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
    function renderGlobe(): JSX.Element {
        // Create a reference to the SVG element that will be rendered.
        const svgRef = useRef<SVGSVGElement>(null);

        // Use the useEffect hook to execute code after the component is mounted or updated.
        useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await fetch('/world.json');
                    const geojson = await response.json();
            
                    const svg = d3.select(svgRef.current);
                    svg.selectAll('*').remove();
            
                    const height = Math.min(windowSize.width / 2, 600);
                    const width = Math.min(windowSize.width / 2, 600);
                    const sensitivity = 75;
                } catch (error) {
                    console.error('Error fetching GeoJSON:', error);
                }
            };
            
            fetchData(); // Invoke the fetchData function to fetch the data
        }, [windowSize]);

        return <svg ref={svgRef} width={Math.min(windowSize.width / 2, 600)} height={Math.min(windowSize.width / 2, 600)} />;
    };

    // Returning the JSX element, which displays a search input and submit button.
    return (
        <section>
            <div>
                {renderGlobe()}
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