import { get, post } from "../../services/index.js"
import CustomError from "../errors/index.js"

async function login(user) {
    try {
        const body = {
            email: user.email,
            password: user.password
        }
        // const res = await post("/login", { body: body })
        // if (res.status !== 200) {
        //     throw new CustomError("failed to login")
        // }
        // return res.data
        return {token:"fake token"}
    } catch (error) {
        throw new CustomError(error.message)
    }
}

async function getUser() {
    try {
        // const res = await get("/user")
        // if (res.status !== 200) {
        //     throw new CustomError("failed to fetch user")
        // }
        return {
            firstName: "Gustavo",
            lastName: "Alberto",
            email: "gustavo.alberto@gmail.com",
            jobTitle: "Medico",
            academicTitle: "Licenciado en medicina",
            country: "Argentina",
            state: "Buenos Airesj",
            city: "CABA",
            institution: "Hospital Italiano"
        }
    } catch (error) {
        throw new CustomError(error.message)
    }
}

export {
    login,
    getUser
}
