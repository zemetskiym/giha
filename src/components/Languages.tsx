// Import necessary modules
import styles from "@/styles/components.Languages.module.css"
import hljs from 'highlight.js'

// Define types/interfaces
interface File {
    patch: string;
    filename: string
}
interface Commit {
    files: Array<File>;
}
interface Props {
    commitData: Array<Commit>;
}

// Define the functional component Languages and pass in Props
export default function Languages(props: Props): JSX.Element {

    // Destructure the props object
    const {commitData} = props

    // Declare an empty array to store results
    let results: Array<object> = []

    // Define a helper function cleanUpDiff to remove unnecessary characters from a string
    function cleanUpDiff(diff: string) {
        // Split the diff string into an array of lines
        const lines = diff.split('\n');
        
        // Create a new array to store the cleaned up lines
        const cleanedLines = [];
        
        // Iterate through each line
        for (let i = 0; i < lines.length; i++) {
          // Check if the line starts with '+' or '-'
          if (lines[i].startsWith('+') || lines[i].startsWith('-')) {
            // Remove the '+' or '-' character from the beginning of the line
            const cleanedLine = lines[i].substring(1)
            
            // Add the cleaned up line to the array
            cleanedLines.push(cleanedLine)
          } else if (lines[i].startsWith('@@')) {
            // If the line starts with '@@', skip it (and the next line)
            i++
          }
        }
        
        // Join the cleaned up lines into a single string and return it
        return cleanedLines.join('\n');
    }

    // Define a helper function getFileExtension to get the file extension of a given filename
    function getFileExtension(filename: string): string {
        return filename.split('.').pop() || '';
    }

    // Loop through each commit in commitData and extract the language of the first file
    commitData.forEach((commit: Commit) => {
        let cleanedDiff = cleanUpDiff(commit.files![0].patch) // Clean up the diff string
        const fileExtension = getFileExtension(commit.files![0].filename) // Get the file extension
        const language = hljs.highlightAuto(cleanedDiff, [fileExtension]).language // Highlight the code and get the detected language

        // If the language is not undefined, push an object with the language name to the results array
        if (language !== undefined) {
            const languageObject = hljs.getLanguage(language)
        
            if (languageObject != undefined) results.push({language: languageObject.name})
        }
    })
    
    // Return the component JSX
    return (
        <>
            <h1>Languages</h1>
        </>
    )
}