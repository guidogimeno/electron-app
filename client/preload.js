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
    mkdir: (dirName) => {
        return ipcRenderer.invoke("mkdir", dirName)
    },
    readFile: (filePath) => {
        return ipcRenderer.invoke("readFile", filePath)
    },
    readFiles: (filePath) => {
        return ipcRenderer.invoke("readFiles", filePath)
    },
    deleteDir: (dirPath) => {
        return ipcRenderer.invoke("deleteDir", dirPath)
    },
    deleteTempDir: (dirPath) => {
        return ipcRenderer.invoke("deleteTempDir", dirPath)
    },
    getPath: () => {
        return ipcRenderer.invoke("getPath")
    },
    moveDir: (dirPath) => {
        return ipcRenderer.invoke("moveDir", dirPath)
    },
})

contextBridge.exposeInMainWorld("bin", {
    execute: (filePath) => {
        return ipcRenderer.invoke("execute", filePath)
    }
})

contextBridge.exposeInMainWorld("pdf", {
    generatePDF: (content) => {
        return ipcRenderer.invoke("generate-pdf", content)
    }
})
