import { app, ipcMain } from "electron"
import fs from "fs"
import path from "node:path"

const REPORTS_PATH = path.join(app.getPath("userData"), "reports")

ipcMain.handle("mkdir", (_, dirName) => {
    const dirPath = path.join(REPORTS_PATH, dirName)
    fs.mkdirSync(dirPath, { recursive: true })
})

ipcMain.handle("writeFile", (_, filePath, file) => {
    const fileDir = path.join(REPORTS_PATH, filePath)
    fs.writeFileSync(fileDir, file, (err) => {
        if (err) {
            console.log("Failed to save file", err)
            throw err
        }
    })
})

ipcMain.handle("readFiles", async (_, filePath) => {
    if (!fs.existsSync(REPORTS_PATH)) {
        return []
    }

    const reportPaths = await fs.promises.readdir(REPORTS_PATH)

    const promises = []
    for (const reportPath of reportPaths) {
        promises.push(readFile(`${reportPath}/${filePath}`))
    }

    return Promise.all(promises);
})

ipcMain.handle("readFile", async (_, filePath) => {
    return readFile(filePath)
})

ipcMain.handle("deleteDir", async (_, dirPath) => {
    const dir = path.join(REPORTS_PATH, dirPath)
    fs.rmSync(dir, { recursive: true, force: true })
})

function readFile(filePath) {
    return fs.promises.readFile(`${REPORTS_PATH}/${filePath}`, "utf8")
}

