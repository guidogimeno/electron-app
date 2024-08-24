import { app, ipcMain } from "electron"
import { spawn } from "child_process"

ipcMain.handle("pyscript", async () => {
    const python = spawn(`${app.getAppPath()}/../scripts/hello`);
    try {
        console.log("ejecutando script")
        python.stdout.on("data", (result) => {
            console.log("stdout", result.toString())
        })
        python.stderr.on("data", (result) => {
            console.log("stderr", result.toString())
        })
        python.on("close", (result) => {
            console.log("close", result)
        })
        python.on("open", (result) => {
            console.log("open", result)
        })
        console.log("termino de ejecutar?")
    } catch (err) {
        console.log("error al ejecutar el script de python", err)
    }
})
