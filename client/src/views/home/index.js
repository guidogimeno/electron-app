import React from "react"
import Page from "../../components/page/index.js"
import { Link } from "react-router-dom"

function Home() {
    const isLoading = false;

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

