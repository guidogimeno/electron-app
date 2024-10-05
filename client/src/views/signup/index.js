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
            setInlineMessage("Error al intentar crear el perfil. Por favor intente de nuevo")
        }
    }

    return (
        <Page hiddeSidebar >
            <div className="signup-container">
                <div className="signup-content">
                    <h1 className="signup-title">Nuevo Usuario</h1>
                    {inlineMessage && <p className="inline-message">{inlineMessage}</p>}

                    <form className="signup-form" onSubmit={handleSubmit}>
                        <div className="inputs-container">
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="input"
                                placeholder="Nombre"
                                required
                            />
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="input"
                                placeholder="Apellido"
                                required
                            />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input"
                                placeholder="Contraseña"
                                required
                            />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input"
                                placeholder="Email"
                                required
                            />
                            <input
                                type="text"
                                id="jobTitle"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleChange}
                                className="input"
                                placeholder="Posicion laboral"
                                required
                            />
                            <input
                                type="text"
                                id="academicTitle"
                                name="academicTitle"
                                value={formData.academicTitle}
                                onChange={handleChange}
                                className="input"
                                placeholder="Titulo academico"
                                required
                            />
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="input"
                                placeholder="Pais"
                                required
                            />
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="input"
                                placeholder="Provincia"
                                required
                            />
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="input"
                                placeholder="Ciudad"
                                required
                            />
                            <input
                                type="text"
                                id="institution"
                                name="institution"
                                value={formData.institution}
                                onChange={handleChange}
                                className="input"
                                placeholder="Institucion"
                                required
                            />
                        </div>
                        <button type="submit" className="primary-button">
                            Registrarme
                        </button>
                    </form>
                    <div className="signup-links">
                        <Link to="/login" className="login-link">
                            Ya tengo una cuenta de Hip-Pal
                        </Link>
                    </div>
                </div>
            </div>
        </Page>
    );
}

export default SignUp

