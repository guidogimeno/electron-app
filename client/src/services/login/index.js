import { get, post } from "../../services/index.js"
import CustomError from "../errors/index.js"

async function login(user) {
    try {
        const body = {
            email: user.email,
            password: user.password
        }
        const res = await post("/login", { body: body })
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
        return {
            firstName: res.data.first_name,
            lastName: res.data.last_name,
            email: res.data.email,
            jobTitle: res.data.job_title,
            academicTitle: res.data.academic_title,
            country: res.data.country,
            state: res.data.state,
            city: res.data.city,
            institution: res.data.institution
        }
    } catch (error) {
        throw new CustomError(error.message)
    }
}

export {
    login,
    getUser
}
