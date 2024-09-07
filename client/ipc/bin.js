import { app, ipcMain } from "electron"
import { spawn } from "child_process"

ipcMain.handle("execute", async (_, filePath) => {
    console.log(`about to execute ${filePath}`)
    return new Promise(function(resolve, reject) {
        const binary = spawn(`${app.getAppPath()}/bin/ia`, [`${filePath}`, `${app.getAppPath()}/reports`]);

        console.log("executing binary")
        binary.stdout.on("data", (result) => {
            console.log(`binary execution stdout: ${result}`)
            resolve(result)
        })

        binary.stderr.on("data", (code) => {
            console.log(`binary execution stderr: ${code}`)
            reject(new Error(`process exited with code ${code}`))
        })
    })
})
