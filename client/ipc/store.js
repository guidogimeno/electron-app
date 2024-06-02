import { ipcMain } from "electron"
import Store from "electron-store"

const schema = {
    token: {
        type: "string",
        default: ""
    }
}

const store = new Store({schema})

ipcMain.handle("getStoreValue", (_, key) => {
    return store.get(key)
})

ipcMain.handle("setStoreValue", (_, key, value) => {
    return store.set(key, value)
})

