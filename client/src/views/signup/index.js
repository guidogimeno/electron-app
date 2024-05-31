import React from "react"
import { Link } from "react-router-dom"

function SignUp() {
    return (
        <div>
            <h1>Sign Up</h1>
            <button>
                <Link to="/login">Login</Link>
            </button>
        </div>
    )
}

export default SignUp

