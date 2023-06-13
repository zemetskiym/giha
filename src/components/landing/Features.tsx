import styles from "../../styles/components/landing/Features.module.css"
import Image from "next/image"

export default function Features (): JSX.Element {
    return (
        <section>
            <div>
                <Image src="/landing/commit-languages-area-chart.svg" height={150} width={300} alt="" />
                <span>
                    <h3>Visualize the Evolution of Your Programming Skills</h3>
                    <p>Uncover the journey of your programming skills with our cumulative stacked area chart. This powerful visualization displays the growth and changes in your preferred programming languages over time, allowing you to track your progress, adapt to emerging technologies, and showcase your expertise.</p>
                </span>
            </div>
            <div>
                <span>
                    <h3>Understand Your Coding Palette at a Glance</h3>
                    <p>Get a visual snapshot of your coding palette with our intuitive pie chart. This dynamic visualization breaks down the distribution of languages on your Github profile, giving you a quick and comprehensive understanding of your programming repertoire and the areas where you excel.</p>
                </span>
                <Image src="/landing/commit-languages-pie-chart.svg" height={150} width={300} alt="" />
            </div>
            <div>
                <Image src="/landing/commits-over-day-of-week.svg" height={300} width={300} alt="" />
                <span>
                    <h3>Master Your Commitment to Excellence</h3>
                    <p>Illuminate your coding journey with our visually engaging line chart, complete with inline labels that reveal the distribution of your commits across different days of the week. Discover your most prolific periods, adapt your coding routine for optimal productivity, and pave the way towards becoming a more accomplished and disciplined developer.</p>
                </span>
            </div>
        </section>
    )
}