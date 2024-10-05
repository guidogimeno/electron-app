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
    getPath: () => {
        return ipcRenderer.invoke("getPath")
    }
})

contextBridge.exposeInMainWorld("bin", {
    execute: (filePath) => {
        return ipcRenderer.invoke("execute", filePath)
    }
})

contextBridge.exposeInMainWorld("pdf", {
    generatePDF: (content) => {
        console.log("estoy en el context bridge", content)
        try {
            return ipcRenderer.invoke("generate-pdf", content)
        } catch (e) {
            console.log("wtf", e)
        }
    }
})
