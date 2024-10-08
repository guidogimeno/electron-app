import React, { useContext, useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import Page from "../../components/page/index.js"
import { getReport } from "../../fs/reports/index.js"
import { GlobalContext } from "../../context/index.js"
import Spinner from "../../components/spinner/index.js"
import { Tabs, Tab } from "../../components/tabs/index.js"
import { generatePDF } from "../../pdf/index.js"

function Hip() {
    const context = useContext(GlobalContext)
    const ref = useRef(null)
    const params = useParams()
    const [report, setReport] = useState(null)
    const [loadingPDF, setLoadingPDF] = useState(false)

    useEffect(function() {
        fetchReport()
    }, [])

    async function handleDownload() {
        setLoadingPDF(true)
        const content = ref.current.outerHTML
        try {
            const downloadPath = await generatePDF(content)
            context.showSuccess(`Reporte descargado en ${downloadPath}`)
        } catch (error) {
            context.showFailure("Error al intentar generar el PDF.")
        } finally {
            setLoadingPDF(false)
        }
    }

    async function fetchReport() {
        try {
            const report = await getReport(params.id)
            setReport(report)
        } catch (error) {
            context.showFailure("Failed to load report")
        }
    }

    function tableFormat(obj) {
        const tableInfo = {
            headers: ["Medicion"]
        }
        if (obj.izquierdo) {
            tableInfo.headers.push("Izquierdo")
        }
        if (obj.derecho) {
            tableInfo.headers.push("Derecho")
        }

        const combinedArray = [];
        const keyValueMap = new Map();

        if (obj.izquierdo) {
            obj.izquierdo.forEach(obj => {
                keyValueMap.set(obj.name, [obj.name.toUpperCase(), `${obj.value}°`]);
            });
        }

        if (obj.derecho) {
            obj.derecho.forEach(obj => {
                if (keyValueMap.has(obj.name)) {
                    keyValueMap.get(obj.name).push(obj.value);
                } else {
                    keyValueMap.set(obj.name, [obj.name.toUpperCase(), `${obj.value}°`]);
                }
            });
        }

        combinedArray.push(...keyValueMap.values());
        tableInfo.data = combinedArray

        return tableInfo
    }

    return (
        <Page>
            {report ?
                <div className="report-container" ref={ref}>
                    <div className="card report_header">
                        <div className="card_title">
                            <h4>{report.name}</h4>
                            <p>Fecha de creacion: {new Date(report.createdDate).toLocaleString()}</p>
                        </div>
                    </div>
                    {
                        report.mediciones.map(medicion => {
                            return (
                                <div key={medicion.name} className="card">
                                    <div className="card_title medicion_title">
                                        <h4>{medicion.name}</h4>
                                    </div>
                                    <div className="card_content">
                                        <Tabs>
                                            {
                                                medicion.angulos.map(angulo => {
                                                    return (
                                                        <Tab key={angulo.name} label={angulo.name}>
                                                            <div className="angulos-container">
                                                                <img className="angulo_img" src={angulo.path}></img>
                                                                <table className="angulo_table">
                                                                    <thead>
                                                                        <tr>
                                                                            {tableFormat(angulo).headers.map(header => <th key={header}>{header}</th>)}
                                                                        </tr>

                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            tableFormat(angulo).data.map(row => {
                                                                                return (
                                                                                    <tr key={row.reduce((acc, cell) => `${acc}+${cell}`, "")}>
                                                                                        {row.map(cell => {
                                                                                            return (
                                                                                                <td key={cell}>{cell}</td>
                                                                                            )
                                                                                        })}
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        }
                                                                    </tbody>
                                                                </table>
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
                    <button disabled={loadingPDF} className="download-button" onClick={handleDownload}>
                        {loadingPDF ? <Spinner /> : "Descargar Reporte"}
                    </button>
                </div> : <Spinner />
            }
        </Page>
    )
}

export default Hip

