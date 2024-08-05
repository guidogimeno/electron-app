import React, { useContext } from "react"
import Page from "../../components/page/index.js"
import { GlobalContext } from "../../context/index.js"

function Profile() {
    const context = useContext(GlobalContext)

    return (
        <Page>
            <label>Name</label>
            <label>{context.user.name}</label>
            <button>Edit</button>
        </Page>
    )
}

export default Profile

