import { post } from "../../services/index.js"

async function login(user) {
	try {
		const res = await post("/login", { body: user })
		console.log("res.data", res.data)
		return res
	} catch (error) {
		console.log(error)
	}
}

export {
	login
}
