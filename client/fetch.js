const { net, ipcMain } = require("electron")

ipcMain.handle("http", async (_, req) => {
    console.log("MAIN: req", req)
    const result = await fetch(req)
    console.log("MAIN: result", result)
    return result
})

async function fetch(req) {
    const res = await net.fetch("http://localhost:3000" + req.path, { 
        method: req.method,
        headers: {
            "Content-Type": "application/json",
            ...req.headers
        },
        body: JSON.stringify(req.body)
    })

    if (res.ok) {
        const body = await res.json()
        return { status: res.status, body: body }
    } else {
        return { status: res.status, body: null }
    }
}
