import { post } from "../../services/index.js"

async function signup(user) {
	try {
		const res = await post("/signup", { body: user })
        if (res.status !== 201) {
            throw CustomError(res.message)
        }
		return res.data
	} catch (error) {
        throw CustomError(error.message)
	}
}

export {
	signup
}

