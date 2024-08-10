import React, { useContext, useEffect } from "react"
import Page from "../../components/page/index.js"
import { getUser } from "../../services/login/index.js"
import { useNavigate } from "react-router-dom"
import { GlobalContext } from "../../context/index.js"
import Spinner from "../../components/spinner/index.js"

function Landing() {
    const navigate = useNavigate()
    const context = useContext(GlobalContext)

    useEffect(() => {
        fetchUser()
    }, [])

    async function fetchUser() {
        try {
            const user = await getUser()
            context.setUser(user)
            navigate("/my_hips")
        } catch (error) {
            navigate("/login")
        }
    }

    return (
        <Page hiddeSidebar>
            <Spinner />
        </Page>
    )
}

export default Landing

