import { ipcMain } from "electron"
import puppeteer from "puppeteer"
import os from "os"
import path from "path"

const downloadsPath = path.join(os.homedir(), "Downloads")

ipcMain.handle("generate-pdf", async (_, content) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(content, { waitUntil: "domcontentloaded" })
    await page.pdf({
        format: "A4",
        path: `${downloadsPath}/hippal_report-${Date.now().toString()}.pdf`,
        printBackground: true,
        margin: {
            top: "20px",
            bottom: "20px",
            left: "20px",
            right: "20px"
        }
    })
    await browser.close()
})

