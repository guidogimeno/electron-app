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
                    {
                        report.mediciones.map(medicion => {
                            return (
                                <div>
                                    <span>{medicion.name}</span>
                                    {
                                        medicion.angulos.map(angulo => {
                                            return (
                                                <div>
                                                    <span>{angulo.name}</span>
                                                    <img src={angulo.path}></img>
                                                    <div>
                                                        {
                                                            angulo.izquierdo.map(izq => {
                                                                return (
                                                                    <div>
                                                                        <span>{izq.name}</span>
                                                                        <span>{izq.value}</span>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                        {
                                                            angulo.derecho.map(der => {
                                                                return (
                                                                    <div>
                                                                        <span>{der.name}</span>
                                                                        <span>{der.value}</span>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </div> : <Spinner />
            }
        </Page>
    )
}

export default Hip

