import { app, ipcMain } from "electron"
import { spawn } from "child_process"

ipcMain.handle("executeBin", async (_, fileName) => {
    console.log(`about to execute ${fileName}`)
    return new Promise(function(resolve, reject) {
        const binary = spawn(`${app.getAppPath()}/bin/${fileName}`);

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
