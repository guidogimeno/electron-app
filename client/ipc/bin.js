import { app, ipcMain } from "electron"
import { spawn } from "child_process"

const userDataPath = app.getPath("userData")

ipcMain.handle("execute", async (_, filePath) => {
    console.log(`about to execute ${filePath}`)
    return new Promise(function(resolve, reject) {
        const binary = spawn(`${userDataPath}/bin/sleep`, [`${filePath}`, `${userDataPath}`]);

        console.log("executing binary")
        binary.stdout.on("data", (result) => {
            console.log(`binary execution stdout: ${result}`)
            if (String(result).startsWith("id:")) {
                const index = result.indexOf(":");
                if (index !== -1) { // Check if index is valid
                    console.log(`el id es: ${result[index + 1]}`)
                    resolve(result[index + 1]); // Extract the value starting from the character after the colon
                }
            }
        })

        binary.stderr.on("data", (code) => {
            console.log(`binary execution stderr: ${code}`)
            reject(new Error(`process exited with code ${code}`))
        })
    })
})
