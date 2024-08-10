import React, { useContext, useState } from "react"
import Page from "../../components/page/index.js"
import { GlobalContext } from "../../context/index.js"
import { updateUser, deleteUser } from "../../services/users/index.js"
import { useNavigate } from "react-router-dom"
import { setStoreValue } from "../../store/index.js"

function Profile() {
    const context = useContext(GlobalContext)
    const navigate = useNavigate()

    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({ ...context.user, password: "******" })

    function handleCancelClick() {
        setIsEditing(false)
        setFormData({ ...context.user, password: "******" })
    }

    async function handleSubmit(event) {
        event.preventDefault()
        try {
            await updateUser(formData)
            context.setUser(formData)
            setIsEditing(false)
        } catch (error) {
            context.showFailure("failed to update user")
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
        } catch (error) {
            context.showFailure("failed to delete user")
        }
    }

    return (
        <Page>
            <form onSubmit={handleSubmit}>
                <label htmlFor="firstName">First Name</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    readOnly={!isEditing}
                />
                <label htmlFor="lastName">Last Name</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    readOnly={!isEditing}
                />
                <label htmlFor="email">Email</label>
                <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    readOnly={!isEditing}
                />
                <label htmlFor="password">Password</label>
                <input
                    type="text"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    readOnly={!isEditing}
                />
                <label htmlFor="jobTitle">Job Title</label>
                <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    readOnly={!isEditing}
                />
                <label htmlFor="academicTitle">Academic Title</label>
                <input
                    type="text"
                    id="academicTitle"
                    name="academicTitle"
                    value={formData.academicTitle}
                    onChange={handleChange}
                    readOnly={!isEditing}
                />
                <label htmlFor="country">Country</label>
                <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    readOnly={!isEditing}
                />
                <label htmlFor="state">State</label>
                <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    readOnly={!isEditing}
                />
                <label htmlFor="city">City</label>
                <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    readOnly={!isEditing}
                />
                <label htmlFor="institution">Institution</label>
                <input
                    type="text"
                    id="institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    readOnly={!isEditing}
                />
                {isEditing ? (
                    <>
                        <button type="submit">Submit</button>
                        <button type="button" onClick={handleCancelClick}>
                            Cancel
                        </button>
                        <button type="button" onClick={handleDelete}>
                            Delete user
                        </button>
                    </>
                ) : (
                    <button type="button" onClick={() => setIsEditing(true)}>Edit</button>
                )}
            </form>
        </Page>
    )
}

export default Profile

