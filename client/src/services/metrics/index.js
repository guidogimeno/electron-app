import { post } from "../../services/index.js"
import CustomError from "../errors/index.js"

async function track(data) {
    try {
        const res = await post("/metrics", { body: data })
        if (res.status !== 201) {
            throw new CustomError("failed to send metrics")
        }
        return res.data
    } catch (error) {
        throw new CustomError(error.message)
    }
}

export {
    track
}
