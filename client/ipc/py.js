import { ipcMain } from "electron"
import { spawn } from "child_process"

ipcMain.handle("pyscript", async () => {
    const python = spawn("python3", ["/home/ggimeno/Documents/electron-app/hola.py"]);
    try {
        console.log("ejecutando script")
        python.stdout.on("data", (result) => {
            console.log("stdout", result.toString())
        })
        python.stderr.on("data", (result) => {
            console.log("stderr", result)
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
