import { app, ipcMain } from "electron"
import { spawn } from "child_process"

const userDataPath = app.getPath("userData")

ipcMain.handle("execute", async (_, filePath) => {
    console.log(`about to execute ${filePath}`)
    return new Promise(function(resolve, reject) {
        const binary = spawn(`${userDataPath}/bin/main`, [`${filePath}`, `${userDataPath}`]);

        console.log("executing binary")
        binary.stdout.on("data", (result) => {
            console.log(`binary execution stdout: ${result}`)
            console.log(`tiene los dos puntos: ${result.includes(":")}`)
            console.log(`indexOf: ${result.indexOf(":")}`)
            const id = String(result).split("id:$")[1]
            console.log(`Este es el id: ${id}`)
            if (id) {
                console.log(`resuelvo con este id: ${id}`)
                resolve(id)
            }
        })

        binary.on("close", (result) => {
            console.log(`closing: ${result}`)
        })

        binary.stderr.on("data", (code) => {
            console.log(`binary execution stderr: ${code}`)
            // reject(new Error(`process exited with code ${code}`))
        })
    })
})
