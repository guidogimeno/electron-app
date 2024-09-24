import CustomError from "../../services/errors/index.js"
import { deleteDir, readFiles, readFile } from "../index.js"

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
        throw new CustomError("Failed to get reports")
    }
}

async function removeReport(id) {
    try {
        await deleteDir(id)
    } catch (error) {
        console.log("Failed to delete report", error)
        throw new CustomError("Failed to delete report")
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
        throw new CustomError("Failed to get report")
    }
}

export {
    getReport,
    getReports,
    removeReport
}
