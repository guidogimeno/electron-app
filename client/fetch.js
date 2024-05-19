const { net, ipcMain} = require("electron")

ipcMain.handle('make-post-request', (callback) => {
    fetchPost()
})

async function fetchPost() {
    const request = net.request({
        method: "POST",
        url: "http://localhost:3000/logueate",
        protocol: "http:",
    })
    request.setHeader("Content-Type", "application/json");
    request.write(JSON.stringify({
        username: "admin",
        password: "admin"
    }), "utf-8")
    request.end()

    request.on("response", (response) => {
        console.log(`STATUS: ${response.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(response.headers)}`);

        response.on("data", (chunk) => {
            console.log(`BODY: ${chunk}`)
        });
    })
}
