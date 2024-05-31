import React from "react"
import { useState } from "react"
import { login } from "../../services/login/index.js"

function Login() {
    const [formData, setFormData] = useState({ username: "", password: "" })

    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    function handleSubmit(event) {
        event.preventDefault()
        login(formData)
    } 

    return (
        <div>
            <h1>Login</h1>
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
        </div>
    )
}

export default Login

