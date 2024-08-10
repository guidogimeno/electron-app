import React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { createUser } from "../../services/users/index.js"
import { useNavigate } from "react-router-dom"
import Page from "../../components/page/index.js"

function SignUp() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        jobTitle: "",
        academicTitle: "",
        country: "",
        state: "",
        city: "",
        institution: ""
    })
    const [inlineMessage, setInlineMessage] = useState("")

    const navigate = useNavigate()

    function handleChange(event) {
        setFormData(prevData => ({
            ...prevData,
            [event.target.name]: event.target.value
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault()
        try {
            await createUser(formData)
            navigate("/")
        } catch (error) {
            setInlineMessage("Failed to sign up. Please try again")
        }
    }

    return (
        <Page hiddeSidebar >
            <div className="signup-container">
                <div className="signup-content">
                    <h1 className="signup-title">Sign Up</h1>
                    {inlineMessage && <p className="inline-message">{inlineMessage}</p>}
                    <form className="signup-form" onSubmit={handleSubmit}>
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="signup-input"
                            required
                        />
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="signup-input"
                            required
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="signup-input"
                            required
                        />
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="signup-input"
                            required
                        />
                        <label htmlFor="jobTitle">Job Title</label>
                        <input
                            type="text"
                            id="jobTitle"
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleChange}
                            className="signup-input"
                            required
                        />
                        <label htmlFor="academicTitle">Academic Title</label>
                        <input
                            type="text"
                            id="academicTitle"
                            name="academicTitle"
                            value={formData.academicTitle}
                            onChange={handleChange}
                            className="signup-input"
                            required
                        />
                        <label htmlFor="country">Country</label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="signup-input"
                            required
                        />
                        <label htmlFor="state">State</label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="signup-input"
                            required
                        />
                        <label htmlFor="city">City</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="signup-input"
                            required
                        />
                        <label htmlFor="institution">Institution</label>
                        <input
                            type="text"
                            id="institution"
                            name="institution"
                            value={formData.institution}
                            onChange={handleChange}
                            className="signup-input"
                            required
                        />
                        <button type="submit" className="signup-button">
                            Sign Up
                        </button>
                    </form>
                    <div className="signup-links">
                        <Link to="/login" className="login-link">
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </Page>
    );
}

export default SignUp

