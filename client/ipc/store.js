import {app,ipcMain } from "electron"
import Store from "electron-store"

const schema = {
    token: {
        type: "string",
        default: ""
    }
}

const store = new Store({schema})

ipcMain.handle("getStoreValue", (_, key) => {

    console.log(app.getPath("userData"))
    return store.get(key)
})

ipcMain.handle("setStoreValue", (_, key, value) => {
    store.set(key, value)
})

