import Head from 'next/head'
import styles from '@/styles/Index.module.css'
import { useState, useEffect } from 'react'
import Home from "../components/landing/Landing"
import Profile from "../components/Profile"
import Languages from '@/components/Languages'
import Commits from '@/components/Commits'
import FunFacts from '@/components/FunFacts'

export default function Index() {
  // Define the structure of the search state
  interface Search {
    user: string, 
    submit: boolean
  }

  // Define types/interfaces
  interface Event {
    actor: {
      login: string
    },
    repo: {
      name: string
    },
    payload: {
      commits: [
        {
          sha: string
        }
      ]
    }
  }
  interface Parent {
    url: string
  }
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
    parents: Array<Parent>,
    files: Array<File>
  }

  // Set up state variables using the useState hook
  const [search, setSearch] = useState<Search>({user: "", submit: false})
  const [userData, setUserData] = useState<object | null>(null)
  const [repoData, setRepoData] = useState<Array<object> | null>(null)
  const [numCommits, setNumCommits] = useState<number>(1)
  const [eventData, setEventData] = useState<Array<Partial<Event>> | null>(null)
  const [commitData, setCommitData] = useState<Array<Commit | null>>([])
  const [error, setError] = useState<string | null>(null)
  const [windowSize, setWindowSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }

    // Add event listener to update window size on resize
    window.addEventListener('resize', handleResize);

    // Initial window size
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Define an asynchronous function to fetch commit data from the Github API
  async function fetchCommit(owner: string, repo: string, sha: string) {
    let commitResponse: Response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${sha}`)
    let commitData: Commit = await commitResponse.json()

    // Handle different HTTP status codes
    if (commitResponse.status >= 200 && commitResponse.status < 300) {
      setCommitData(prev => [...prev, commitData])
    }
    else if (commitResponse.status == 404) {
      setError("Please enter a valid username.")
    }
    else if (commitResponse.status == 403) {
      setError("Please wait for the API rate limit to reset.")
    }
    else {
      setError(`Unknown error code: ${commitResponse.status}.`)
    }
  }

  // Define an asynchronous function to fetch user, repository, and event data from the GitHub API
  async function fetchData() {
    // Fetch user data
    let userResponse: Response = await fetch(`https://api.github.com/users/${search.user}`)
    let userData: object = await userResponse.json()

    // Handle different HTTP status codes
    if (userResponse.status >= 200 && userResponse.status < 300) {
      setUserData(userData)
    }
    else if (userResponse.status == 404) {
      setError("Please enter a valid username.")
    }
    else if (userResponse.status == 403) {
      setError("Please wait for the API rate limit to reset.")
    }
    else {
      setError(`Unknown error code: ${userResponse.status}.`)
    }

    // Fetch repository data
    let repoResponse: Response = await fetch(`https://api.github.com/users/${search.user}/repos?per_page=100`)
    let repoData: Array<object> = await repoResponse.json()

    // Handle different HTTP status codes
    if (repoResponse.status >= 200 && repoResponse.status < 300) {
      setRepoData(repoData)
    }
    else if (repoResponse.status == 404) {
      setError("Please enter a valid username.")
    }
    else if (repoResponse.status == 403) {
      setError("Please wait for the API rate limit to reset.")
    }
    else {
      setError(`Unknown error code: ${repoResponse.status}.`)
    }

    // Fetch event data
    let eventResponse: Response = await fetch(`https://api.github.com/users/${search.user}/events/public?event=PushEvent&per_page=${numCommits}`)
    let eventData: Array<object> = await eventResponse.json()

    // Handle different HTTP status codes
    if (eventResponse.status >= 200 && eventResponse.status < 300) {
      setEventData(eventData)
    }
    else if (eventResponse.status == 404) {
      setError("Please enter a valid username.")
    }
    else if (eventResponse.status == 403) {
      setError("Please wait for the API rate limit to reset.")
    }
    else {
      setError(`Unknown error code: ${eventResponse.status}.`)
    }

    if (eventData != null) {
      eventData.forEach((event: Partial<Event>) => {
        // Call async fetchCommit function because async operations are not allowed in forEach loops
        if (event.payload!.commits != undefined) {
          fetchCommit(event.repo!.name.split("/")[0], event.repo!.name.split("/")[1], event.payload!.commits[0].sha)
        } else {
          setCommitData(prev => [...prev, null])
        }
      })
    }
  }

  // Use the useEffect hook to remove error messages after 5000 milliseconds of being set
  useEffect(() => {
    if (error != null) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Use the useEffect hook to call fetchData() when the search.submit variable changes
  useEffect(() => {
    if(search.submit == true) fetchData()
  }, [search.submit])

  // Render either the Home or data analysis components based on whether userData and repoData are null or not
  return (
    <>
      {userData == null && <Home search={search} setSearch={setSearch} numCommits={numCommits} setNumCommits={setNumCommits} />}

      {userData != null && repoData != null && <Profile userData={userData} repoData={repoData} />}
      
      {eventData != null && commitData.length == eventData.length && <Languages commitData={commitData} windowSize={windowSize} />}

      {eventData != null && commitData.length == eventData.length && <Commits commitData={commitData} windowSize={windowSize} />}

      {eventData != null && commitData.length == eventData.length && <FunFacts commitData={commitData} windowSize={windowSize} />}

      {error != null && <p>{error}</p>}
    </>
  )
}
