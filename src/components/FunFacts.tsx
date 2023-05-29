import styles from "../styles/components/FunFacts.module.css"
import { useEffect, useState } from "react"

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
    console.log(filteredCommitData)

    type Convention = 'camelCase' | 'snakeCase' | 'pascalCase' | 'kebabCase';

    // Function to count the occurrences of programming conventions
    function countProgrammingConventions(filteredCommitData: Array<Commit>): string {
        // Initialize count object
        let count: Record<Convention, number> = {camelCase: 0, snakeCase: 0, pascalCase: 0, kebabCase: 0};

        // Regular expressions for different conventions
        const regexes = {
            camelCase: /[a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]*/g,
            snakeCase: /\b[a-z][a-zA-Z0-9]*_[a-z][a-zA-Z0-9]*\b/g,
            pascalCase: /[A-Z]([A-Z0-9]*[a-z][a-z0-9]*[A-Z]|[a-z0-9]*[A-Z][A-Z0-9]*[a-z])[A-Za-z0-9]*/g,
            kebabCase: /\b[a-z][a-zA-Z0-9]*-[a-z][a-zA-Z0-9]*\b/g,
        };
        
        // Function to count matches for a given regex
        function countMatches(regex: RegExp, diff: string) {
            return (diff.match(regex) || []).length;
        };
        
        // Iterate over filtered commit data
        for (let commit of filteredCommitData) {
            const patch = commit.files[0].patch;

            // Count matches for each convention
            for (let convention in regexes) {
                count[convention as Convention] += countMatches(regexes[convention as Convention], patch);
            };
        };

        // Find the convention with the highest count
        const maxProperty = Object.entries(count).reduce((prev, [prop, value]) => {
            if (value > prev.value) {
              return { prop, value };
            }
            return prev;
        }, { prop: '', value: -Infinity });
        
        // Return the most-used programming convention
        if (maxProperty.prop == "camelCase") return "camelCase";
        if (maxProperty.prop == "snakeCase") return "snake_case";
        if (maxProperty.prop == "pascalCase") return "PascalCase";
        if (maxProperty.prop == "kebabCase") return "kebab-case";
        return "camelCase"; // Default convention
    };

    // Function to count the average LOC per commit
    function findAvgLOC(filteredCommitData: Array<Commit>): number {
        let sum = 0;
        for (let commit of filteredCommitData) {
            sum += commit.files[0].patch.split("\n").length;
        };
        return sum / filteredCommitData.length;
    };

    // Function to return the day of the week with the most commits
    function findMostProductiveDayOfWeek(filteredCommitData: Array<Commit>): string {
        // Initialize count object
        let count: Record<string, number> = {Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0};

        // Iterate over filtered commit data
        for (let commit of filteredCommitData) {
            const date = new Date(commit.commit.author.date);
            const day = date.getDay();
            count[Object.keys(count)[day]] += 1;
        };

        // Find the day with the most commits
        const maxProperty = Object.entries(count).reduce((prev, [prop, value]) => {
            if (value > prev.value) {
              return { prop, value };
            };
            return prev;
        }, { prop: '', value: -Infinity });
        
        // Return the most productive day of the week
        return maxProperty.prop;
    };

    // Function to find the most productive time of day
    function findMostProductiveTimeOfDay(filteredCommitData: Array<Commit>): string {
        // Initialize count object
        let count: Record<string, number> = {morning: 0, afternoon: 0, evening: 0, night: 0};

        // Iterate over filtered commit data
        for (let commit of filteredCommitData) {
            const date = new Date(commit.commit.author.date);
            const hour = date.getHours();
            if (hour < 12) count.morning += 1;
            else if (hour < 17) count.afternoon += 1;
            else if (hour < 20) count.evening += 1;
            else count.night += 1;
        };

        // Find the most productive time of day
        const maxProperty = Object.entries(count).reduce((prev, [prop, value]) => {
            if (value > prev.value) {
              return { prop, value };
            };
            return prev;
        }, { prop: '', value: -Infinity });
        
        // Return the most productive time of day
        return maxProperty.prop;
    };

    return (
        <>
            <h1>Fun Facts</h1>
            <div>I average {findAvgLOC(filteredCommitData).toFixed(2)} lines of code (LOC) per commit</div>
            <div>I consistently follow the <code>{countProgrammingConventions(filteredCommitData)}</code> programming convention</div>
            <div>My most productive days are {findMostProductiveDayOfWeek(filteredCommitData)}s</div>
            <div>I commit my code in {findMostProductiveTimeOfDay(filteredCommitData)}s</div>
        </>
    );
};