import styles from "../../styles/components/landing/Features.module.css"
import Image from "next/image"

export default function Features (): JSX.Element {
    return (
        <>
            <section>
                <div>
                    <Image src="/landing/commit-languages-area-chart.svg" height={150} width={300} alt="" />
                    <span>
                        <h3>Visualize the evolution of your programming skills</h3>
                        <p>Uncover the journey of your programming skills with our cumulative stacked area chart. This powerful visualization displays the growth and changes in your preferred programming languages over time, allowing you to track your progress, adapt to emerging technologies, and showcase your expertise.</p>
                    </span>
                </div>
                <div>
                    <span>
                        <h3>Understand your coding palette at a glance</h3>
                        <p>Get a visual snapshot of your coding palette with our intuitive pie chart. This dynamic visualization breaks down the distribution of languages on your Github profile, giving you a quick and comprehensive understanding of your programming repertoire and the areas where you excel.</p>
                    </span>
                    <Image src="/landing/commit-languages-pie-chart.svg" height={150} width={300} alt="" />
                </div>
                <div>
                    <Image src="/landing/commits-over-day-of-week.svg" height={300} width={300} alt="" />
                    <span>
                        <h3>Master your commitment to excellence</h3>
                        <p>Illuminate your coding journey with our visually engaging line chart, complete with inline labels that reveal the distribution of your commits across different days of the week. Discover your most prolific periods, adapt your coding routine for optimal productivity, and pave the way towards becoming a more accomplished and disciplined developer.</p>
                    </span>
                </div>
            </section>
            <section>
                <span>
                    <div>
                        <Image src="/icons/download.svg" height={40} width={40} alt="" />
                    </div>
                    <div>
                        <h4>Download and share</h4>
                        <p>Download each chart with a simple click, making it easy to share your insights and findings with others. Whether it's for a presentation, a blog post, or a portfolio, our tool enables you to effortlessly showcase your coding journey.</p>
                    </div>
                </span>
                <span>
                    <div>
                        <Image src="/icons/shield-checkmark.svg" height={40} width={40} alt="" />
                    </div>
                    <div>
                        <h4>Secure authenticated user data</h4>
                        <p>Be rest assured that your authenticated user data is handled with utmost care. We prioritize the security and privacy of your information, ensuring that it remains confidential and protected throughout the analysis process.</p>
                    </div>
                </span>
                <span>
                    <div>
                        <Image src="/icons/code.svg" height={40} width={40} alt="" />
                    </div>
                    <div>
                        <h4>Open source</h4>
                        <p>We believe in the power of collaboration and transparency. That's why our project is open source, allowing developers like you to explore, contribute, and enhance the tool's functionalities. Join our community and help us shape the future of Github profile analysis.</p>
                    </div>
                </span>
            </section>
        </>
    )
}