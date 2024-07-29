import { ipcMain } from "electron"
import fs from "fs"

ipcMain.handle("writeFile", (_, algo) => {
    console.log("me llego esto", algo)
    fs.writeFile("hello.pdf", "Hello, World!", (err) => {
        if (err) {
            console.log("falle creando el maldito archivo")
            throw err;
        }
        console.log("File created successfully!");
    });

})

