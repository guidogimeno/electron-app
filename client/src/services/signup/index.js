import { post, put } from "../../services/index.js"
import CustomError from "../errors/index.js"

async function signup(user) {
    try {
        const res = await post("/user", { body: user })
        if (res.status !== 201) {
            throw new CustomError("failed to signup")
        }
        return res.data
    } catch (error) {
        throw new CustomError(error.message)
    }
}

async function updateUser(user) {
    try {
        const res = await put("/user", { body: user })
        if (res.status !== 200) {
            throw new CustomError("failed to update user")
        }
        return res.data
    } catch (error) {
        throw new CustomError(error.message)
    }
}

export {
    signup,
    updateUser
}

