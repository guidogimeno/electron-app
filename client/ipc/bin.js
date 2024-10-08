import { app, ipcMain } from "electron"
import { spawn } from "child_process"

const userDataPath = app.getPath("userData")

ipcMain.handle("execute", async (_, filePath) => {
    console.log(`FILEPATH ${filePath}`)
    console.log(`USERDATAPATH ${userDataPath}`)
    return new Promise(function(resolve, reject) {
        const binary = spawn("python", ["D:\\Usuarios\\Usuario\\Desktop\\electron-app\\Hip-Pal_v2\\main.py", `${filePath}`, `${userDataPath}`]);

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
            // Cerrar con 0 es que finalizo sin errores
            if (data === 0) {
                resolve(data)
            } else {
                reject(data)
            }
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
