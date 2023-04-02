import Head from 'next/head'
import styles from '@/styles/Index.module.css'
import { useState, useEffect } from 'react'
import Home from "../components/Home"
import Profile from "../components/Profile"

export default function Index() {
  interface Search {
    user: string, 
    submit: boolean
  }
  const [search, setSearch] = useState<Search>({user: "", submit: false})
  const [userData, setUserData] = useState<object | null>(null)
  const [repoData, setRepoData] = useState<object | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function fetchData() {
    let userResponse: Response = await fetch(`https://api.github.com/users/${search.user}`)
    let userData: object = await userResponse.json()
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

    let repoResponse: Response = await fetch(`https://api.github.com/users/${search.user}/repos`)
    let repoData: object = await repoResponse.json()
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

  useEffect(() => {
    if(search.submit == true) fetchData()
  }, [search.submit])

  return (
    <>
      {userData == null && <Home search={search} setSearch={setSearch} />}

      {userData != null && repoData != null && <Profile userData={userData} repoData={repoData} />}
    </>
  )
}
