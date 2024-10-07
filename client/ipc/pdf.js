import { ipcMain } from "electron"
import { jsPDF } from "jspdf"

ipcMain.handle("generate-pdf", async (_, content) => {
    console.log("entre al ipc")
    const doc = new jsPDF()
    console.log("este es el doc", doc)
    console.log("este es el content", content)
    doc.html(content)
    doc.save("output.pdf")
})

