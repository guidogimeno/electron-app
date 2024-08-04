import { app, ipcMain } from "electron"
import fs from "fs"
import path from "node:path"

// La informacion se guarda en ~/.config/[package.json -> name]

ipcMain.handle("mkdir", (_, reportName) => {
    const reportDir = path.join(app.getPath("userData"), "reports", reportName)
    console.log("Estoy por guardar este reporte aca", reportDir)
    fs.mkdirSync(reportDir, { recursive: true })
})

ipcMain.handle("writeFile", (_, filePath, file) => {
    console.log("file name and content", filePath, file)
    const fileDir = path.join(app.getPath("userData"), "reports", filePath)
    fs.writeFileSync(fileDir, file, (err) => {
        if (err) {
            console.log("Failed to save file")
            throw err
        }
        console.log("File created successfully!")
    })
})

