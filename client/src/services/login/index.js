import { get, post } from "../../services/index.js"
import CustomError from "../errors/index.js"

async function login(user) {
    try {
        const res = await post("/login", { body: user })
        if (res.status !== 200) {
            throw new CustomError("failed to login")
        }
        return res.data
    } catch (error) {
        throw new CustomError(error.message)
    }
}

async function getUser() {
    try {
        const res = await get("/user")
        if (res.status !== 200) {
            throw new CustomError("failed to fetch user")
        }
        return res.data
    } catch (error) {
        throw new CustomError(error.message)
    }
}

export {
    login,
    getUser
}
