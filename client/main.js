const { app, BrowserWindow } = require("electron/main")
const electronReload = require("electron-reload")
const path = require("node:path")
require("./fetch.js")

electronReload(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron")
})

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            worldSafeExecuteJavaScript: true,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        }
    })

    win.loadFile("index.html")
}

app.whenReady().then(() => {
    createWindow()

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})
