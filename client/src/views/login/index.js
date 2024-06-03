import React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { login } from "../../services/login/index.js"
import { setStoreValue } from "../../store/index.js"

function Login() {
    const [formData, setFormData] = useState({ username: "", password: "" })

    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    async function handleSubmit(event) {
        event.preventDefault()
        try {
            const res = await login(formData)
            console.log(res)
            setStoreValue("token", res.token)
        } catch (error) {
            console.log(error)
        }
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
            <button>
                <Link to="/">SignUp</Link>
            </button>
        </div>
    )
}

export default Login

