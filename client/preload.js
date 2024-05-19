const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electronAPI", {
    fetch: () => ipcRenderer.invoke("make-post-request", "http://localhost:3000/logueate"),
})
