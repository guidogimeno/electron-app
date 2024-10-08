import CustomError from "../../services/errors/index.js"
import { deleteDir, readFiles, readFile, moveDir, writeFile, deleteTempDir } from "../index.js"

const CONTENT_FILE = "angulos.json"
const REPORTS_PATH = "/reports"
const TEMP_REPORTS_PATH = "/temp-reports"

function filePath(fileName, folder) {
    return `${REPORTS_PATH}/${folder}/${fileName}`
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

async function updateReport(reportId, idPatient, age, metrics) {
    try{
        const file = await readFile(`${TEMP_REPORTS_PATH}/${reportId}/${CONTENT_FILE}`);
        const report = JSON.parse(file);
        
        const newInfo = {
            idPatient: idPatient,
            age: age,
            sex: metrics.sex,
            age: metrics.age,
            country: metrics.country,
            pain_level: metrics.painLevel,
            site_of_pain: metrics.siteOfPain,
            mos_since_symp: metrics.mosSinceSymp,
            sport: metrics.sport,
            sport_level: metrics.sportLevel,
            flexion: metrics.flexion,
            extension: metrics.extension,
            internal_rotation: metrics.internalRotation,
            external_rotation: metrics.externalRotation,
            craig_test: metrics.craigTest,
            fadir: metrics.fadir,
            faber: metrics.faber,
            log_roll: metrics.logRoll,
            ab_heer: metrics.abHeer
        };
        
        // Agregar la nueva información al objeto report
        Object.assign(report, newInfo);

        // Guardar el archivo JSON actualizado
        await writeFile(`/${reportId}/${CONTENT_FILE}`, JSON.stringify(report, null, 4));
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
