import React, { useEffect, useState } from "react"
import Page from "../../components/page/index.js"
import { Link } from "react-router-dom"
import { reports } from "../../services/reports/index.js"

function Home() {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadShit()
    }, [])

    async function loadShit() {
        setIsLoading(true)
        await reports()
        setIsLoading(false)
    }

    return (
        <Page>
            {isLoading ? <span> loading ... </span> :
                <>
                    <div>Home</div>
                    <Link to="/login" >Login</Link>
                    <Link to="/signup" >Signup</Link>
                </>
            }
        </Page>
    )
}

export default Home

