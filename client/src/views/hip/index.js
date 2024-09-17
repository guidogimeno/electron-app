import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Page from "../../components/page/index.js"
import { getReport } from "../../fs/reports/index.js"
import { GlobalContext } from "../../context/index.js"
import Spinner from "../../components/spinner/index.js"
import { Tabs, Tab } from "../../components/tabs/index.js"

function Hip() {
    const context = useContext(GlobalContext)
    const params = useParams()
    const [report, setReport] = useState(null)

    useEffect(function() {
        fetchReport()
    }, [])

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
                <div className="report-container">
                    <div className="card report_header">
                        <div className="card_title">
                            <h4>{report.name}</h4>
                            <p>Fecha de creacion: {new Date(report.createdDate).toLocaleString()}</p>
                        </div>
                    </div>
                    {
                        report.mediciones.map(medicion => {
                            return (
                                <div className="card">
                                    <div className="card_title medicion_title">
                                        <h4>{medicion.name}</h4>
                                    </div>
                                    <div className="card_content">
                                        <Tabs>
                                            {
                                                medicion.angulos.map(angulo => {
                                                    return (
                                                        <Tab label={angulo.name}>
                                                            <div>
                                                                <img className="medicion_img" src={angulo.path}></img>
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
                                                        </Tab>
                                                    )
                                                })
                                            }
                                        </Tabs>
                                    </div>
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

