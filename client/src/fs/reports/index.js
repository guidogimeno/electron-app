import CustomError from "../../services/errors/index.js"
import { mkdir, writeFile } from "../index.js"

async function saveReport(report) {
    const reportFolder = report.id
    try {
        await mkdir(reportFolder)
        await writeFile(filePath("content.txt", reportFolder), report.content)
        await writeFile(filePath("metadata.json", reportFolder), JSON.stringify({
            name: report.name,
            created_date: Date.now()
        }))
        for (image in report.images) {
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

export {
    saveReport
}
