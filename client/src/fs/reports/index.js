import CustomError from "../../services/errors/index.js"
import { deleteDir, readFiles, readFile, writeFile, deleteTempDir } from "../index.js"

const CONTENT_FILE = "angulos.json"

function filePath(fileName, folder) {
    return `${folder}/${fileName}`
}

async function getReports() {
    try {
        const files = await readFiles(CONTENT_FILE)
        const reports = []
        for (const file of files) {
            const report = JSON.parse(file)
            reports.push({
                ...report,
                date: new Date(report.createdDate).toISOString().split("T")[0]
            })
        }
        return reports
    } catch (error) {
        console.log("Failed to get reports", error)
        throw new CustomError("Error al buscar los reportes.")
    }
}

async function removeReport(id) {
    try {
        await deleteDir(id)
    } catch (error) {
        console.log("Failed to delete report", error)
        throw new CustomError("Error al borrar reporte.")
    }
}

async function removeTempReport(id) {
    try {
        await deleteTempDir(id)
    } catch (error) {
        console.log("Error al intentar borrar reporte temporal", error)
        throw new CustomError("Error al borrar archivos temporales")
    }
}


async function getReport(reportId) {
    try {
        const file = await readFile(filePath(CONTENT_FILE, reportId))
        const report = JSON.parse(file)
        return {
            ...report,
            date: new Date(report.createdDate).toISOString().split("T")[0]
        }
    } catch (error) {
        console.log(`Failed to get report: ${reportId} for the following reason: ${error}`)
        throw new CustomError("Error al buscar el reporte")
    }
}

async function moveReport(id) {
    try {
        await moveDir(id)
    } catch (error) {
        console.log("Error al mover el reporte", error)
        throw new CustomError("Error al cargar el reporte.")
    }
}

async function updateReport(reportId, idPatient, age) {
    try{
        const file = await readFile(filePath(CONTENT_FILE, reportId));
        const report = JSON.parse(file);
        
        const newInfo = {"idPatient": idPatient, "age": age};
        
        // Agregar la nueva información al objeto report
        Object.assign(report, newInfo);

        // Guardar el archivo JSON actualizado
        await writeFile(filePath(CONTENT_FILE, reportId), JSON.stringify(report, null, 4));
    } catch (error) {
        console.log(`Failed to update report: ${reportId} for the following reason: ${error}`)
        throw new CustomError("Error al actualizar el reporte")
    } 
}

export {
    getReport,
    getReports,
    removeReport,
    updateReport,
    removeTempReport,
    moveReport
}
