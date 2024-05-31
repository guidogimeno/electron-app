import { post } from "../../services/index.js"

async function signup(user) {
	try {
		const res = await post("/signup", { body: user })
		return res
	} catch (error) {
		console.log(error)
	}
}

export {
	signup
}

