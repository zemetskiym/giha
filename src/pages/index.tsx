import Head from 'next/head'
import styles from '@/styles/Index.module.css'
import { useState, useEffect } from 'react'
import Home from "../components/Home"
import Profile from "../components/Profile"

export default function Index() {
  // Define the structure of the search state
  interface Search {
    user: string, 
    submit: boolean
  }

  // Set up state variables using the useState hook
  const [search, setSearch] = useState<Search>({user: "", submit: false})
  const [userData, setUserData] = useState<object | null>(null)
  const [repoData, setRepoData] = useState<object | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Define an asynchronous function to fetch user and repository data from the GitHub API
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
    let repoResponse: Response = await fetch(`https://api.github.com/users/${search.user}/repos`)
    let repoData: object = await repoResponse.json()

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
  }

  // Use the useEffect hook to call fetchData() when the search.submit variable changes
  useEffect(() => {
    if(search.submit == true) fetchData()
  }, [search.submit])

  // Render either the Home or Profile component based on whether userData and repoData are null or not
  return (
    <>
      {userData == null && <Home search={search} setSearch={setSearch} />}

      {userData != null && repoData != null && <Profile userData={userData} repoData={repoData} />}
    </>
  )
}
