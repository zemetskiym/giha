import Head from 'next/head';
import styles from '@/styles/Index.module.css';
import { useState, useEffect } from 'react';
import Home from "../components/landing/Landing";
import Profile from "../components/Profile";
import Languages from '@/components/Languages';
import Commits from '@/components/Commits';
import FunFacts from '@/components/FunFacts';
import { useWindowSizeContext } from '@/components/context';
import { useSession } from "next-auth/react";

// Extend the SessionData interface from 'next-auth' to include the accessToken property
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
  }
}

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
  const [search, setSearch] = useState<Search>({user: "", submit: false});
  const [userData, setUserData] = useState<object | null>(null);
  const [repoData, setRepoData] = useState<Array<object> | null>(null);
  const [numCommits, setNumCommits] = useState<number>(1);
  const [eventData, setEventData] = useState<Array<Partial<Event>> | null>(null);
  const [commitData, setCommitData] = useState<Array<Commit | null>>([]);
  const [error, setError] = useState<string | null>(null);
  const windowSize = useWindowSizeContext();

  // Retrieving the user's NextAuth.js session data
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  // Define an asynchronous function to fetch commit data from the Github API
  async function fetchCommit(owner: string, repo: string, sha: string) {
    let commitResponse: Response
    if (session && accessToken) {
      commitResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${sha}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    } else {
      commitResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${sha}`)
    }
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
    let userResponse: Response
    if (session && accessToken) {
      userResponse = await fetch(`https://api.github.com/users/${search.user}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    } else {
      userResponse = await fetch(`https://api.github.com/users/${search.user}`)
    }
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
    let repoResponse: Response
    if (session && accessToken) {
      repoResponse = await fetch(`https://api.github.com/users/${search.user}/repos?per_page=100`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    } else {
      repoResponse = await fetch(`https://api.github.com/users/${search.user}/repos?per_page=100`)
    }
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
    let eventResponse: Response;
    let page = 1;
    let combinedData: Array<object> = [];
    let numberOfCalls: number = Math.ceil(numCommits / 100);
    for (let i = 0; i < numberOfCalls; i++) {
      if (session && accessToken) {
        eventResponse = await fetch(`https://api.github.com/users/${search.user}/events/public?event=PushEvent&per_page=${numCommits}&page=${page}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      } else {
        eventResponse = await fetch(`https://api.github.com/users/${search.user}/events/public?event=PushEvent&per_page=${numCommits}&page=${page}`)
      }
      let eventJSON: Array<object> = await eventResponse.json();
      page++

      // Handle different HTTP status codes
      if (eventResponse.status >= 200 && eventResponse.status < 300) {
        combinedData.push(...eventJSON);
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
    }
    setEventData(combinedData);
  }
  console.log(eventData)

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

  useEffect(() => {
    if (eventData != null && eventData.length > 0 && commitData.length == 0) {
      eventData.forEach((event: Partial<Event>) => {
        // Call async fetchCommit function because async operations are not allowed in forEach loops
        if (event.payload!.commits != undefined && event.payload!.commits[0] != undefined) {
          fetchCommit(event.repo!.name.split("/")[0], event.repo!.name.split("/")[1], event.payload!.commits[0].sha)
        } else {
          setCommitData(prev => [...prev, null])
        }
      })
    }
  }, [eventData])

  // Render either the Home or data analysis components based on whether userData and repoData are null or not
  return (
    <>
      {userData == null && <Home search={search} setSearch={setSearch} numCommits={numCommits} setNumCommits={setNumCommits} />}

      {userData != null && repoData != null && <Profile userData={userData} repoData={repoData} />}
      
      {eventData != null && commitData.length == eventData.length && <Languages commitData={commitData} />}

      {eventData != null && commitData.length == eventData.length && <Commits commitData={commitData} />}

      {eventData != null && commitData.length == eventData.length && <FunFacts commitData={commitData} />}

      {error != null && <p>{error}</p>}
    </>
  )
}
