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
    const [formData, setFormData] = useState({
        username: context.user.username,
        email: context.user.email
    })

    function handleCancelClick() {
        setIsEditing(false)
        setFormData({
            username: context.user.username,
            email: context.user.email
        })
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
            context.setUser({ username: "", email: "" })
            navigate("/login")
        } catch (error) {
            context.showFailure("failed to delete user")
        }
    }

    return (
        <Page>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        readOnly={!isEditing}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        readOnly={!isEditing}
                        onChange={handleChange}
                    />
                </div>
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

