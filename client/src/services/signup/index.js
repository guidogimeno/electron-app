import { post } from "../../services/index.js"

async function signup(user) {
    try {
        const res = await post("/signup", { body: user })
        if (res.status !== 201) {
            throw new CustomError("failed to signup")
        }
        return res.data
    } catch (error) {
        throw new CustomError(error.message)
    }
}

export {
    signup
}

