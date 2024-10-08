import { ipcMain, dialog } from "electron"
import puppeteer from "puppeteer"
import path from "path"
import fs from "fs"

const IMG_TAG_REGEX = /<img\s+[^>]*src="([^"]+)"[^>]*>/g;

ipcMain.handle("generate-pdf", async (_, html) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openDirectory']
    })

    if (canceled || filePaths.length == 0) {
        return ""
    }

    const downloadPath = filePaths[0]
    const htmlWithImages = imgSrcToBase64(html)

    await toPDF(htmlWithImages, downloadPath)

    return downloadPath
})

function imgSrcToBase64(html) {
    const htmlString = html.replace(IMG_TAG_REGEX, (match, src) => {
        const imagePath = path.resolve(src) // Resolve the image path
        try {
            // Read the image file and convert it to Base64
            const fileExtension = path.extname(imagePath).slice(1) // Extract extension without the dot
            const imageData = fs.readFileSync(imagePath).toString("base64")

            // Create the Base64 data URL
            const base64Image = `data:image/${fileExtension};base64,${imageData}`

            // Replace the original src with the Base64 data
            return match.replace(src, base64Image)
        } catch (error) {
            console.error(`Error reading image file: ${imagePath}`, error)
            return match // Return the original tag if there was an error
        }
    })
    return htmlString
}

async function toPDF(html, downloadPath) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: "domcontentloaded" })
    await page.addStyleTag({ path: "./src/views/hip/styles.css" })
    await page.pdf({
        format: "A4",
        path: `${downloadPath}/hippal_report-${Date.now().toString()}.pdf`,
        printBackground: true,
        margin: {
            top: "20px",
            bottom: "20px",
            left: "20px",
            right: "20px"
        }
    })
    await browser.close()
}
