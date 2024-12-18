import React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { login } from "../../services/login/index.js"
import { setStoreValue } from "../../store/index.js"
import { useNavigate } from "react-router-dom"
import Page from "../../components/page/index.js"
import { validateFormData } from "../../components/validation/index.js";

function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [inlineMessage, setInlineMessage] = useState("")
    const [formErrors, setFormErrors] = useState({})

    const navigate = useNavigate()

    function handleChange(event) {
        setFormData(prevData => ({
            ...prevData,
            [event.target.name]: event.target.value
        }))
    }

    function validate() {
        setFormErrors({})
        const customMessages = {
            email: "Por favor, ingrese su email",
            password: "Por favor, ingrese su contraseña"
        };
        setInlineMessage("")
        const errors = validateFormData(formData, Object.keys(customMessages), customMessages)
        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    async function handleSubmit(event) {
        event.preventDefault()
        if(validate()){
            try {
                const res = await login(formData)
                await setStoreValue("token", res.token)
                navigate("/")
            } catch (error) {
                setInlineMessage("Credenciales incorrectas. Verifica tu nombre de usuario y contraseña e inténtalo nuevamente")
            }
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
                            className={`input ${formErrors.email ? 'error' : ''}`}
                            placeholder="Email"
                        />
                        {formErrors.email && <p className="error-message">{formErrors.email}</p>}
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`input ${formErrors.password ? 'error' : ''}`}
                            placeholder="Contraseña"
                        />
                        {formErrors.password && <p className="error-message">{formErrors.password}</p>}
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
            <p className="version-text">Versión 1.0 / oct 2024</p>
        </Page>
    )
}

export default Login

