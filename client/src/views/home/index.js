import React, { useContext } from "react"
import Page from "../../components/page/index.js"
import { Link } from "react-router-dom"
import Spinner from "../../components/spinner/index.js"
import { GlobalContext } from "../../context/index.js"

function Home() {
    const context = useContext(GlobalContext)

    function handleClick() {
        context.showNotification("hello world", "success")
    }

    return (
        <Page>
            {false ? <Spinner /> :
                <>
                    <div>Home</div>
                <button onClick={handleClick}>Press me </button>
                    <Link to="/login" >Login</Link>
                    <Link to="/signup" >Signup</Link>
                </>
            }
        </Page>
    )
}

export default Home

