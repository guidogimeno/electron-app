import React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { signup } from "../../services/signup/index.js"

function SignUp() {
    const [formData, setFormData] = useState({ username: "", password: "" })

    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    function handleSubmit(event) {
        event.preventDefault()
        signup(formData)
    } 

    return (
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input
                        type="text"
                        name="username"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    <p>Password</p>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </label>
                <input type="submit" value="Submit" />
            </form>
            <button>
                <Link to="/login">Login</Link>
            </button>
        </div>
    )
}

export default SignUp

