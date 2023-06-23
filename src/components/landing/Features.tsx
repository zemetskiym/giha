import styles from "../../styles/components/landing/Features.module.css";
import Image from "next/image";
import Link from 'next/link';

export default function Features (): JSX.Element {
    return (
        <>
            <section>
                <div className={styles.feature}>
                    <Image priority={true} className={styles.featureImage} src="/landing/commit-languages-area-chart.svg" height={150} width={300} alt="" />
                    <span className={styles.featureText}>
                        <h3 className={styles.featureTextTitle}>Visualize the evolution of your programming skills</h3>
                        <p className={styles.featureTextParagraph}>Uncover the journey of your programming skills with our cumulative stacked area chart. This powerful visualization displays the growth and changes in your preferred programming languages over time, allowing you to track your progress, adapt to emerging technologies, and showcase your expertise.</p>
                    </span>
                </div>
                <div className={styles.feature}>
                    <span className={styles.featureText}>
                        <h3 className={styles.featureTextTitle}>Understand your coding palette at a glance</h3>
                        <p className={styles.featureTextParagraph}>Get a visual snapshot of your coding palette with our intuitive pie chart. This dynamic visualization breaks down the distribution of languages on your Github profile, giving you a quick and comprehensive understanding of your programming repertoire and the areas where you excel.</p>
                    </span>
                    <Image id={styles.pieChart} className={styles.featureImage}  src="/landing/commit-languages-pie-chart.svg" height={150} width={150} alt="" />
                </div>
                <div className={styles.feature}>
                    <Image className={styles.featureImage}  src="/landing/commits-over-LOC.svg" height={150} width={150} alt="" />
                    <span className={styles.featureText}>
                        <h3 className={styles.featureTextTitle}>Master your commitment to excellence</h3>
                        <p className={styles.featureTextParagraph}>Gain insights into your coding patterns and productivity with our bar chart showcasing the distribution of commits over various lines of code (LOC). This visualization allows you to see the frequency of your commits based on the size of the code changes, helping you understand where you spend the most time and effort in your projects.</p>
                    </span>
                </div>
            </section>
            <section id={styles.additionalFeatureSection}>
                <span className={styles.additionalFeature}>
                    <div className={styles.additionalFeatureBox}>
                        <Image className={styles.additionalFeatureIcon} src="/icons/download.svg" height={30} width={30} alt="" />
                    </div>
                    <div>
                        <h4 className={styles.additionalFeatureTitle}>Download and share</h4>
                        <p className={styles.additionalFeatureParagraph}>Download each chart with a simple click, making it easy to share your insights and findings with others.</p>
                    </div>
                </span>
                <span className={styles.additionalFeature}>
                    <div className={styles.additionalFeatureBox}>
                        <Image className={styles.additionalFeatureIcon} src="/icons/shield-checkmark.svg" height={30} width={30} alt="" />
                    </div>
                    <div>
                        <h4 className={styles.additionalFeatureTitle}>Secure authenticated user data</h4>
                        <p className={styles.additionalFeatureParagraph}>We prioritize the security and privacy of your information, ensuring that it remains confidential and protected throughout the analysis process.</p>
                    </div>
                </span>
                <span className={styles.additionalFeature}>
                    <div className={styles.additionalFeatureBox}>
                        <Image className={styles.additionalFeatureIcon} src="/icons/code.svg" height={30} width={30} alt="" />
                    </div>
                    <div>
                        <h4 className={styles.additionalFeatureTitle}>Open source</h4>
                        <p className={styles.additionalFeatureParagraph}>We believe in the power of collaboration and transparency. That&apos;s why our project is open source, allowing developers like you to explore, contribute, and enhance the tool&apos;s functionalities.</p>
                    </div>
                </span>
            </section>
            <section id={styles.exploreSection}>
                <button id={styles.exploreButton}>
                    <Link id={styles.exploreLink} target="_blank" href="https://github.com/zemetskiym/oauthenticity">Explore the code</Link>
                </button>
            </section>
        </>
    )
}