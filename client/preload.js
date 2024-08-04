const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("http", {
    fetch: async (req) => {
        const res = await ipcRenderer.invoke("fetch", req)
        return res
    }
})

contextBridge.exposeInMainWorld("store", {
    getStoreValue: async (key) => {
        return ipcRenderer.invoke("getStoreValue", key)
    },
    setStoreValue: async (key, value) => {
        return ipcRenderer.invoke("setStoreValue", key, value)
    }
})

contextBridge.exposeInMainWorld("fs", {
    writeFile: (filePath, file) => {
        return ipcRenderer.invoke("writeFile", filePath, file)
    },
    mkdir: (reportName) => {
        return ipcRenderer.invoke("mkdir", reportName)
    }
})

