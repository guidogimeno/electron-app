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
                        <h1 style={{ fontSize: "1.875rem", fontWeight: "bold" }}>Laboratorio de Examenes HIP-PAL</h1>
                        <p style={{ fontSize: "1rem" }}>Precisión | Cuidado | Inmediato</p>
                    </div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <p>0123456789 | 0912345678</p>
                    <p>hippallab@hippal.com</p>
                </div>
            </header>

            <div style={{ backgroundColor: "#e0f2f1", padding: "1rem", marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.875rem" }}>TTE. GRAL. JUAN DOMINGO PERÓN 4190, C1199 CDAD. AUTÓNOMA DE BUENOS AIRES</p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <div>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>{report.name}</h2>
                    <p>Edad: {report.age} Años</p>
                    <p>Sexo: {report.metrics.find(m => m.key === "Sexo")?.value}</p>
                    <p>ID del paciente: {report.idPatient}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                    <p>Muestra tomada en: Hospital Italiano</p>
                    <p>Referido por: Dr. Hip Specialist</p>
                    <p>Registrado el: {report.createdDate}</p>
                </div>
            </div>

            <h2 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.75rem" }}>Resultados del Examen de Cadera</h2>

            {report.mediciones.map((medicion, index) => (
                <div key={index} style={{ marginBottom: "2.25rem" }}>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: "semibold", marginBottom: "0.75rem" }}>{medicion.name}</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Investigacion</th>
                                <th>Izquierda</th>
                                <th>Derecha</th>
                                <th>Valor de referencia</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicion.angulos.flatMap(angulo =>
                                angulo.izquierdo ?
                                    angulo.izquierdo.map((item, i) => (
                                        <tr key={Object.values(item).reduce((acc, val) => `${acc}${val}`, "")}>
                                            <td>{item.name}</td>
                                            <td style={{ textAlign: "center" }}>{item.value}°</td>
                                            <td style={{ textAlign: "center" }}>{angulo.derecho?.[i]?.value ? `${angulo.derecho?.[i]?.value}°` : "N/A"}</td>
                                            <td style={{ textAlign: "center" }}>{item.valorLimite || item.valorNormal || "N/A"}</td>
                                        </tr>
                                    ))
                                    :
                                    angulo.valor?.map(item => (
                                        <tr key={Object.values(item).reduce((acc, val) => `${acc}${val}`, "")}>
                                            <td>{item.name}</td>
                                            <td style={{ textAlign: "center" }} colSpan={2}>{item.value}°</td>
                                            <td style={{ textAlign: "center" }}>{item.valorNormal || "N/A"}</td>
                                        </tr>
                                    ))
                            )}
                        </tbody>
                    </table>
                </div>
            ))}
            <div style={{ marginTop: "3rem" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "semibold", marginBottom: "0.75rem" }}>Métricas Adicionales</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Metric</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.metrics.map((metric, index) => (
                            <tr key={index}>
                                <td>{metric.key}</td>
                                <td>{metric.value || "N/A"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div>
                {
                    report.mediciones.map(medicion => {
                        return medicion.angulos.map(angulo => {
                            return (
                                <img key={angulo.path} src={angulo.path}></img>
                            )
                        })
                    })
                }
            </div>

            <div style={{ marginTop: "3rem", display: "flex", justifyContent: "space-between" }}>
                <div>
                    <p style={{ fontWeight: "semibold" }}>Técnico de Laboratorio Médico</p>
                    <p>(DMLT, BMLT)</p>
                </div>
                <div>
                    <p style={{ fontWeight: "semibold" }}>Dr. Hip Specialist</p>
                    <p>(MD, Ortopedista)</p>
                </div>
            </div>

            <footer style={{ marginTop: "3rem", textAlign: "center", fontSize: "0.875rem" }}>
                <p>Generado el: {new Date().toLocaleString()}</p>
                <p>Página 1 de 1</p>
            </footer>
        </div>
    )
}

const ForwardDiv = forwardRef(PDFReport)

export default ForwardDiv

