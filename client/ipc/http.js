import { net, ipcMain } from "electron"

ipcMain.handle("fetch", async (_, req) => {
	console.log("MAIN: req", req)
	const res = await fetch(req)
	console.log("MAIN: res", res)
	return res
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

	try {
		const data = await res.json()
		return { status: res.status, data: data }
	} catch (error) {
		return { status: res.status, data: null }
	}

}
