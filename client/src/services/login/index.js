const { post } = require("../../services")

async function login(user) {
	try {
		const res = await post("/login", { body: user })
		console.log("res.data", res.data)
		return res
	} catch (error) {
		console.log(error)
	}
}

module.exports = {
	login
}
