import { app, ipcMain } from "electron"
import { spawn } from "child_process"

const userDataPath = app.getPath("userData")

ipcMain.handle("execute", async (_, filePath) => {
    console.log(`FILEPATH ${filePath}`)
    console.log(`USERDATAPATH ${userDataPath}`)
    return new Promise(function(resolve, reject) {
        const binary = spawn(`${userDataPath}/bin/main`, [`${filePath}`, `${userDataPath}`]);

        binary.stdout.on("data", (data) => {
            console.log(`LOG INFO - stdout: ${data}`)
            const id = String(data).split("hippal_stdout:$")[1]
            if (id) {
                console.log(`Id generado: ${id}`)
                resolve(id)
            }
        })

        binary.on("close", (data) => {
            console.log(`LOG INFO - close: ${data}`)
        })

        binary.stderr.on("data", (data) => {
            console.log(`LOG INFO - stderr: ${data}`)
            const errorMessage = String(data).split("hippal_stderr:$")[1]
            if (errorMessage) {
                reject(new Error(`process exited with code ${errorMessage}`))
            }
        })
    })
})
