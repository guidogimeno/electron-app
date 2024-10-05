import { ipcMain } from "electron"
import puppeteer from "puppeteer"

ipcMain.handle("generate-pdf", async (_, content) => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(content);
    await page.pdf({ path: 'example.pdf', format: 'A4' });
    await browser.close();
})

