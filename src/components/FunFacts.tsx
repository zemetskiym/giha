import styles from "../styles/components/FunFacts.module.css"

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
    commitData: Array<Commit | null>,
    windowSize: {height: number, width: number}
}

export default function Commits(props: Props): JSX.Element {

    // Destructure the props object
    const {commitData = [], windowSize} = props;
    const filteredCommitData = commitData.filter(Boolean) as Array<Commit>;

    return (
        <>
            <h1>Fun Facts</h1>
        </>
    );
};