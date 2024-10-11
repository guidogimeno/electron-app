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

    useEffect(function () {
        fetchReport()
    }, [])

    async function handleDownload() {
        setLoadingPDF(true)
        const content = ref.current.outerHTML
        try {
            const downloadPath = await generatePDF(content)
            if (downloadPath === "") {
                // apreto cancelar
                return
            }
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
            context.showFailure("Error al cargar el reporte.")
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
        if (obj.valor) {
            tableInfo.headers.push("Valor")
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
                    keyValueMap.get(obj.name).push(`${obj.value}°`);
                } else {
                    keyValueMap.set(obj.name, [obj.name.toUpperCase(), `${obj.value}°`]);
                }
            });
        }

        if (obj.valor) {
            obj.valor.forEach(obj => {
                keyValueMap.set(obj.name, [obj.name.toUpperCase(), `${obj.value}°`]);
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
                    {/*                     <div className="card report_metrics">
                        <table className="metrics-table ">
                            <tbody>
                                {
                                    report.metrics.slice(0, Math.ceil(report.metrics.length / 2))
                                        .map(metric => {
                                            return (
                                                <tr key={metric.key}>
                                                    <td className="metric-key">
                                                        {metric.key}
                                                    </td>
                                                    <td className="metric-value">
                                                        {metric.value}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                }
                            </tbody>
                        </table>
                        <table className="metrics-table">
                            <tbody>
                                {
                                    report.metrics.slice(Math.ceil(report.metrics.length / 2), report.metrics.length).map(metric => {
                                        return (
                                            <tr key={metric.key}>
                                                <td className="metric-key">
                                                    {metric.key}
                                                </td>
                                                <td className="metric-value">
                                                    {metric.value}
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div> */}
                    <div className="card report_metrics">
                        <table className="angles-table ">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Izquierdo</th>
                                    <th>Derecho</th>
                                    <th>Valor Límite/Normal</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{report.mediciones[0].angulos[0].izquierdo[0].name + " " + report.mediciones[0].angulos[0].name}</td>
                                    <td>{report.mediciones[0].angulos[0].izquierdo[0].value + "°"}</td>
                                    <td>{report.mediciones[0].angulos[0].derecho[0].value + "°"}</td>
                                    <td>{report.mediciones[0].angulos[0].derecho[0].valorLimite}</td>
                                </tr>
                                <tr>
                                    <td>{report.mediciones[0].angulos[1].izquierdo[0].name + " " + report.mediciones[0].angulos[1].name}</td>
                                    <td>{report.mediciones[0].angulos[1].izquierdo[0].value + "°"}</td>
                                    <td>{report.mediciones[0].angulos[1].derecho[0].value + "°"}</td>
                                    <td>{report.mediciones[0].angulos[1].derecho[0].valorLimite}</td>
                                </tr>
                                <tr>
                                    <td>{report.mediciones[0].angulos[2].izquierdo[0].name + " " + report.mediciones[0].angulos[2].name}</td>
                                    <td>{report.mediciones[0].angulos[2].izquierdo[0].value + "°"}</td>
                                    <td>{report.mediciones[0].angulos[2].derecho[0].value + "°"}</td>
                                    <td>{report.mediciones[0].angulos[2].derecho[0].valorLimite}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>{report.mediciones[0].angulos[0].izquierdo[1].name + " " + report.mediciones[0].angulos[0].name}</td>
                                    <td>{report.mediciones[0].angulos[0].izquierdo[1].value + "°"}</td>
                                    <td>{report.mediciones[0].angulos[0].derecho[1].value + "°"}</td>
                                    <td>{report.mediciones[0].angulos[0].derecho[1].valorLimite}</td>
                                </tr>
                                <tr>
                                    <td>{report.mediciones[0].angulos[1].izquierdo[1].name + " " + report.mediciones[0].angulos[1].name}</td>
                                    <td>{report.mediciones[0].angulos[1].izquierdo[1].value + "°"}</td>
                                    <td>{report.mediciones[0].angulos[1].derecho[1].value + "°"}</td>
                                    <td>{report.mediciones[0].angulos[1].derecho[1].valorLimite}</td>
                                </tr>
                                <tr>
                                    <td>{report.mediciones[0].angulos[2].izquierdo[1].name + " " + report.mediciones[0].angulos[2].name}</td>
                                    <td>{report.mediciones[0].angulos[2].izquierdo[1].value + "°"}</td>
                                    <td>{report.mediciones[0].angulos[2].derecho[1].value + "°"}</td>
                                    <td>{report.mediciones[0].angulos[2].derecho[1].valorLimite}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="angles-table ">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Valor</th>
                                    <th>Valor Normal</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{report.mediciones[3].name}</td>
                                    <td>{report.mediciones[3].angulos[0].valor[0].value + "°"}</td>
                                    <td>{report.mediciones[3].angulos[0].valor[0].valorNormal}</td>
                                </tr>
                                <tr>
                                    <td>{report.mediciones[4].name}</td>
                                    <td>{report.mediciones[4].angulos[0].valor[0].value + "°"}</td>
                                    <td>{report.mediciones[4].angulos[0].valor[0].valorNormal}</td>
                                </tr>
                                <tr>
                                    <td>{report.mediciones[5].name}</td>
                                    <td>{report.mediciones[5].angulos[0].valor[0].value + "°"}</td>
                                    <td>{report.mediciones[5].angulos[0].valor[0].valorNormal}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="button-container">
                        <button disabled={loadingPDF} className="download-button" onClick={handleDownload}>
                            {loadingPDF ? <Spinner /> : <><i className="fas fa-download"></i> Descargar Reporte</>}
                        </button>
                    </div>
                    {
                        report.mediciones.map(medicion => {
                            return (
                                <div key={medicion.name} className="card_reporte">
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
                    <div className="button-container">
                        <button disabled={loadingPDF} className="download-button" onClick={handleDownload}>
                            {loadingPDF ? <Spinner /> : <><i className="fas fa-download"></i> Descargar Reporte</>}
                        </button>
                    </div>
                </div> : (
                    <div className="spinner-container">
                        <Spinner />
                    </div>
                )}
        </Page >
    )
}

export default Hip

