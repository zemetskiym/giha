import styles from "@/styles/components.Languages.module.css"

interface Props {
    commitData: Array<object>
}

export default function Languages(props: Props): JSX.Element {

    // https://api.github.com/users/${user}/events/public?event=PushEvent&per_page=${perPage}

    return (
        <>
            <h1>Languages</h1>
        </>
    )
}