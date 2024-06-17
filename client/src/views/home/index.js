import React from "react"
import Page from "../../components/page/index.js"
import { Link } from "react-router-dom"

function Home() {
    return (
        <Page>
            <div>Home</div>
            <Link to="/login" >Login</Link>
            <Link to="/signup" >Signup</Link>
        </Page>
    )
}

export default Home

