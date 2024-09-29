import { app, ipcMain } from "electron"
import { spawn } from "child_process"

const userDataPath = app.getPath("userData")

ipcMain.handle("execute", async (_, filePath) => {
    console.log(`about to execute ${filePath}`)
    return new Promise(function(resolve, reject) {
        const binary = spawn(`${userDataPath}/bin/main`, [`${filePath}`, `${userDataPath}`]);

        binary.stdout.on("data", (result) => {
            const id = String(result).split("hippal_stdout:$")[1]
            if (id) {
                console.log(`Id generado: ${id}`)
                resolve(id)
            }
        })

        binary.on("close", (result) => {
            console.log(`Cerrando ejecutable: ${result}`)
        })

        binary.stderr.on("data", (data) => {
            const errorMessage = String(data).split("hippal_stderr:$")[1]
            if (errorMessage) {
                reject(new Error(`process exited with code ${errorMessage}`))
            }
        })
    })
})
