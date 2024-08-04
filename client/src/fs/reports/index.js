import CustomError from "../../services/errors/index.js"
import { deleteDir, mkdir, readFiles, writeFile } from "../index.js"

const CONTENT_FILE = "content.json"

async function saveReport(report) {
    const reportFolder = report.id
    try {
        await mkdir(reportFolder)

        const path = filePath(CONTENT_FILE, reportFolder)
        await writeFile(path, JSON.stringify({
            id: report.id,
            name: report.name,
            content: report.content,
            created_date: Date.now()
        }))

        for (const image of report.images) {
            const fileName = `${image.name}.png`
            await writeFile(filePath(fileName, reportFolder), image.file);
        }
    } catch (error) {
        console.log("Failed to save report for the following reason:", error)
        throw new CustomError("Failed to save report")
    }
}

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
                id: report.id,
                name: report.name,
                description: "saraza saraza",
                date: new Date(report.created_date).toISOString().split("T")[0]
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

export {
    saveReport,
    getReports,
    removeReport
}
