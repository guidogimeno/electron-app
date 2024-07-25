import { get } from "../../services/index.js"
import CustomError from "../errors/index.js"

async function reports(token) {
    try {
        const res = await get("/resource")
        if (res.status !== 200) {
            throw new CustomError(res.message)
        }
        return res.data
    } catch (error) {
        throw new CustomError(error.message)
    }
}

export {
    reports
}

