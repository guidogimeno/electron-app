import React, { useContext, useState } from "react"
import Page from "../../components/page/index.js"
import { GlobalContext } from "../../context/index.js"
import { updateUser, deleteUser } from "../../services/users/index.js"
import { useNavigate } from "react-router-dom"
import { setStoreValue } from "../../store/index.js"
import ConfirmationModal from "../../components/confirmation_modal/index.js"

function Profile() {
    const context = useContext(GlobalContext)
    const navigate = useNavigate()

    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({ ...context.user, password: "******" })
    const [open, setOpen] = useState(false)

    function handleCancelClick() {
        setIsEditing(false)
        setFormData({ ...context.user, password: "******" })
    }

    async function handleSubmit(event) {
        event.preventDefault()

        // Avoid password override
        const data = {
            ...formData,
            password: formData.password === "******" ? "" : formData.password
        }

        try {
            await updateUser(data)
            context.setUser(formData)
            setIsEditing(false)
            context.showSuccess("cuenta actualizada con exito")
        } catch (error) {
            context.showFailure("error al intentar actualizar la cuenta")
        }
    }

    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        })
    }

    async function handleDelete() {
        try {
            await deleteUser()
            await setStoreValue("token", "")
            context.setUser(null)
            navigate("/login")
            context.showSuccess("cuenta eliminada con exito")
        } catch (error) {
            context.showFailure("error al intentar borrar la cuenta")
        }
    }

    return (
        <Page>
            <div className="profile-container">
                <h1 className="profile-title">Mi Perfil</h1>
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="inputs-container">
                        <div className="label-input">
                            <label htmlFor="firstName">Nombre</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="input"
                                readOnly={!isEditing}
                            />
                        </div>
                        <div className="label-input">
                            <label htmlFor="lastName">Apellido</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="input"
                                readOnly={!isEditing}
                            />
                        </div>
                        <div className="label-input">
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input"
                                readOnly={!isEditing}
                            />
                        </div>
                        <div className="label-input">
                            <label htmlFor="password">Contraseña</label>
                            <input
                                type="text"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input"
                                readOnly={!isEditing}
                            />
                        </div>
                        <div className="label-input">
                            <label htmlFor="jobTitle">Posicion laboral</label>
                            <input
                                type="text"
                                id="jobTitle"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleChange}
                                className="input"
                                readOnly={!isEditing}
                            />
                        </div>
                        <div className="label-input">
                            <label htmlFor="academicTitle">Titulo academico</label>
                            <input
                                type="text"
                                id="academicTitle"
                                name="academicTitle"
                                value={formData.academicTitle}
                                onChange={handleChange}
                                className="input"
                                readOnly={!isEditing}
                            />
                        </div>
                        <div className="label-input">
                            <label htmlFor="country">Pais</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="input"
                                readOnly={!isEditing}
                            />
                        </div>
                        <div className="label-input">
                            <label htmlFor="state">Provincia</label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="input"
                                readOnly={!isEditing}
                            />
                        </div>
                        <div className="label-input">
                            <label htmlFor="city">Ciudad</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="input"
                                readOnly={!isEditing}
                            />
                        </div>
                        <div className="label-input">
                            <label htmlFor="institution">Institucion</label>
                            <input
                                type="text"
                                id="institution"
                                name="institution"
                                value={formData.institution}
                                onChange={handleChange}
                                className="input"
                                readOnly={!isEditing}
                            />
                        </div>
                    </div>
                    <div className="button-container">
                        {isEditing ? (
                            <>
                                <div className="top-buttons">
                                    <button className="tertiary-button" type="button" onClick={handleCancelClick}>
                                        Cancelar
                                    </button>
                                    <button className="primary-button" type="submit">
                                        Modificar
                                    </button>
                                </div>
                                <button className="danger-button" type="button" onClick={() => setOpen(true)}>
                                    Eliminar Cuenta
                                </button>
                            </>
                        ) : (
                            <button className="primary-button" type="button" onClick={() => setIsEditing(true)}>Editar</button>
                        )}
                    </div>
                </form>
            </div>
            <ConfirmationModal
                open={open}
                onCancel={() => setOpen(false)}
                onConfirmation={async () => {
                    await handleDelete();
                    setOpen(false);
                }} >
                ¿Seguro que quieres eliminar esta cuenta?
            </ConfirmationModal>
        </Page>
    )
}

export default Profile

