import React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { login } from "../../services/login/index.js"
import { setStoreValue } from "../../store/index.js"
import { useNavigate } from "react-router-dom"
import Page from "../../components/page/index.js"

function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" })
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
            const res = await login(formData)
            await setStoreValue("token", res.token)
            navigate("/")
        } catch (error) {
            setInlineMessage("Failed to login. Please try again")
        }
    }

    return (
        <Page hiddeSidebar>
            <div className="login-container">
                <div className="login-content">
                    <h1 className="login-title">Inicio de Sesión</h1>
                    <p className="inline-message">{inlineMessage}</p>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <input
                            id="email"
                            name="email"
                            type="text"
                            value={formData.email}
                            onChange={handleChange}
                            className="input"
                            placeholder="Email"
                            required
                        />
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input"
                            placeholder="Contraseña"
                            required
                        />
                        <button type="submit" className="primary-button">
                            Ingresar
                        </button>
                    </form>
                    <div className="login-links">
                        <Link className="login-link">
                            Olvidé mi Contraseña
                        </Link>
                        <Link to="/signup" className="login-link">
                            Crear una Cuenta
                        </Link>
                    </div>
                </div>
            </div>
            <p class="version-text">Versión 1.0 / oct 2024</p>
        </Page>
    )
}

export default Login

