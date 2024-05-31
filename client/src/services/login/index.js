import { post } from "../../services/index.js"

async function login(user) {
	try {
		const res = await post("/login", { body: user })
		return res
	} catch (error) {
		console.log(error)
	}
}

export {
	login
}
