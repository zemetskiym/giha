import styles from "../styles/components/Commits.module.css"

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
    commitData: Array<Commit | null>;
}

export default function Commits(props: Props): JSX.Element {
    
    // Destructure the props object
    const {commitData = []} = props
    const filteredCommitData = commitData.filter(Boolean) as Array<Commit>

    return (
        <div>
            <h1>Commits</h1>
        </div>
    )
} 