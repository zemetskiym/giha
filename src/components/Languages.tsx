// Import necessary modules
import styles from "@/styles/components.Languages.module.css"
import hljs from 'highlight.js'
import { languageColors } from "../../public/languageColors";

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
        // Clean up the diff string of the first file in the commit
        let cleanedDiff = cleanUpDiff(commit.files![0].patch)

        // Get the file extension of the first file in the commit
        const firstFileExtension = getFileExtension(commit.files![0].filename)

        // Use highlight.js to auto-detect the language of the cleaned up diff, based on the first file's extension
        const detectedLanguage = hljs.highlightAuto(cleanedDiff, [firstFileExtension]).language

        // If the detected language is not undefined, add an object with the language name and color to the results array
        if (detectedLanguage !== undefined) {
            // Get more information about the detected language from highlight.js
            const detectedLanguageInfo = hljs.getLanguage(detectedLanguage)

            // If we have information about the detected language and its name, add it to the results array
            if (detectedLanguageInfo != undefined && detectedLanguageInfo.name != undefined) {
                // If we have a color for the detected language, add the name and color to the results array
                if (languageColors.hasOwnProperty(`${detectedLanguageInfo.name}`)) {
                    const languageName = detectedLanguageInfo.name
                    const languageColor = languageColors[languageName]
                    results.push({language: languageName, color: languageColor})
                }
            }
        }
    })

    
    // Return the component JSX
    return (
        <>
            <h1>Languages</h1>
            {results.map((commit: any, index: number) => (
                <small key={index}>{commit.language}: {commit.color}</small>
            ))}
        </>
    )
}