import { post } from "../../services/index.js"
import CustomError from "../errors/index.js"

async function login(user) {
    try {
        const res = await post("/login", { body: user })
        if (res.status !== 200) {
            throw new CustomError(res.message)
        }
        return res.data
    } catch (error) {
        throw new CustomError(error.message)
    }
}

export {
    login
}
