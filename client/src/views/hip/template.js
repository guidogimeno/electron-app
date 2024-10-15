import React, { forwardRef } from "react"

function PDFReport(props, ref) {
    const { report } = props
    console.log("este es el reporte:", report)

    if (!report) return null

    return (
        <div ref={ref} style={{ display: "none", minHeight: "100vh", backgroundColor: "#fff", padding: "3rem", fontFamily: "sans-serif" }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img src="src/assets/logo-hippal.jpeg" alt="Hippal Logo" width={100} height={100} style={{ marginRight: "2.5rem" }} />
                    <div>
                        <h1 style={{ fontSize: "1.875rem", fontWeight: "bold" }}>HIP-PAL Análisis Automático</h1>
                        <p style={{ fontSize: "1rem" }}>Precisión | Cuidado | Inmediato</p>
                    </div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <p>0123456789 | 0912345678</p>
                    <p>hippallab@hippal.com</p>
                    <p>Todos los derechos reservados</p>
                </div>
            </header>

            <div style={{ display: "flex", flexDirection: "column", marginBottom: "1.5rem" }}>
                <div>
                    <div>
                        <span>Usuario: </span><span>{report.name}</span>
                    </div>
                    <div>
                        <span>Area: </span><span>Cirugia de Cadera</span>
                    </div>
                    <div>
                        <span>Fecha de estudio: </span><span>{new Date(report.createdDate).toISOString().split("T")[0]}</span>
                    </div>
                </div>

                <table style={{ padding: '20px 0' }}>
                    <thead>
                        <tr>
                            <th colSpan={2}>Datos del paciente</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.metrics.map(metric => {
                            return (
                                <tr key={metric.key}>
                                    <td>{metric.key}</td>
                                    <td>{metric.value || "N/A"}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                <table style={{ padding: '20px 0' }}>
                    <thead>
                        <tr>
                            <th colSpan={4}>Mediciones Automáticas</th>
                        </tr>
                        <tr>
                            <th style={{ textAlign: 'left' }}>Angulos acetabulartes sectoriales</th>
                            <th>Izquierdo</th>
                            <th>Derecho</th>
                            <th>Valor de referencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.mediciones.map(medicion => {
                            return medicion.angulos.map(angulo => {
                                return tableFormat(angulo).data.map(row => {
                                    return (
                                        <tr key={row.reduce((acc, cell) => `${acc}+${cell}`, "")}>
                                            {
                                                row.map((cell, cellIndex) => {
                                                    return (
                                                        <td
                                                            key={cell}
                                                            style={{ textAlign: `${cellIndex === 0 ? "left" : "center"}` }}
                                                            colSpan={`${cellIndex === 1 && row.length === 3 ? "2" : "1"}`}
                                                        >
                                                            {
                                                                cellIndex === 0
                                                                    ? `${cell} ${angulo.name}`
                                                                    : cell
                                                            }
                                                        </td>
                                                    )
                                                })
                                            }
                                        </tr>
                                    )
                                })
                            })
                        })}
                    </tbody>
                </table>

                <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', padding: '20px 0' }}>
                    {
                        report.mediciones.map(medicion => {
                            return medicion.angulos.map((angulo) => {
                                return (
                                    <div style={{ width: '33.33%', height: 'auto', padding: '20px 0' }}>
                                        <p style={{ color: 'black' }}>{medicion.name}</p>
                                        <p style={{ color: 'black' }}>{angulo.name}</p>
                                        <img
                                            key={angulo.path}
                                            src={angulo.path}
                                            style={{ width: '100%', height: 'auto' }}
                                        >
                                        </img>
                                    </div>
                                )
                            })
                        })
                    }
                </div>
            </div>
        </div >
    )
}

/**
 * @typedef Angulo
 * @type {object}
 * @property {Array.<Array.<string>>} data - contenido de la tabla: lista de filas
 */

/**
  * @param {object} obj 
  * @returns {Angulo}
  */
function tableFormat(obj) {
    const combinedArray = [];
    const keyValueMap = new Map();

    if (obj.izquierdo) {
        obj.izquierdo.forEach(obj => {
            keyValueMap.set(obj.name, [
                obj.name.toUpperCase(),
                `${obj.value}°`,
                "N/A",
                obj.valorLimite ? `${obj.valorLimite}` : "N/A"
            ]);
        });
    }

    if (obj.derecho) {
        obj.derecho.forEach(obj => {
            if (keyValueMap.has(obj.name)) {
                keyValueMap.get(obj.name)[2] = `${obj.value}°`
            } else {
                keyValueMap.set(obj.name, [
                    obj.name.toUpperCase(),
                    "N/A",
                    `${obj.value}°`,
                    obj.valorLimite ? `${obj.valorLimite}` : "N/A"
                ]);
            }
        });
    }

    if (obj.valor) {
        obj.valor.forEach(obj => {
            keyValueMap.set(obj.name, [obj.name.toUpperCase(), `valor ${obj.value}°`, `valor ${obj.valorNormal}`]);
        });
    }

    combinedArray.push(...keyValueMap.values());

    return {
        data: combinedArray
    }
}

const ForwardDiv = forwardRef(PDFReport)

export default ForwardDiv

