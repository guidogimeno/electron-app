import React, { useContext, useState } from "react"
import Page from "../../components/page/index.js"
import { GlobalContext } from "../../context/index.js"
import { updateUser } from "../../services/signup/index.js"

function Profile() {
    const context = useContext(GlobalContext)

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
                    </>
                ) : (
                    <button type="button" onClick={() => setIsEditing(true)}>Edit</button>
                )}
            </form>
        </Page>
    )
}

export default Profile

