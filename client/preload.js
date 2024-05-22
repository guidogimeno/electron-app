const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("http", {
    fetch: async (req) => {
        console.log("BROWSER: req", req)
        const result = ipcRenderer.invoke("http", req)
        console.log("BROWSER: result", result)
        return result
    }
})
