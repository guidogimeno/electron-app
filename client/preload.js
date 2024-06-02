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

