import React from "react"
import { useParams } from "react-router-dom"
import Page from "../../components/page/index.js"

function Hip() {
    const params = useParams()
    return (
        <Page>
            <div>{params.id}</div>
        </Page>
    )
}

export default Hip

