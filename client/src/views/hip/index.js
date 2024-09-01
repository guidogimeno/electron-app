import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Page from "../../components/page/index.js"
import { getReport } from "../../fs/reports/index.js"
import { GlobalContext } from "../../context/index.js"
import Spinner from "../../components/spinner/index.js"
import { getPath } from "../../fs/index.js"

function Hip() {
    const context = useContext(GlobalContext)
    const params = useParams()
    const [report, setReport] = useState(null)
    const [appPath, setAppPath] = useState("")

    useEffect(function() {
        fetchAppPath()
        fetchReport()
    }, [])

    async function fetchAppPath() {
        const path = await getPath()
        setAppPath(path)
    }

    async function fetchReport() {
        try {
            const report = await getReport(params.id)
            setReport(report)
        } catch (error) {
            context.showFailure("Failed to load report")
        }
    }

    return (
        <Page>
            {report ?
                <div>
                    <div>{report.id}</div>
                    <div>{report.name}</div>
                    <div>{JSON.stringify(report.content)}</div>
                    <img src={`${appPath}/${report.id}/angulos.jpeg`}></img>
                </div> : <Spinner />
            }
        </Page>
    )
}

export default Hip

