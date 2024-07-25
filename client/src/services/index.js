import { getStoreValue } from "../store/index.js"

const methods = {
    POST: "POST",
    GET: "GET",
    PUT: "PUT",
    DELETE: "DELETE"
}

async function get(path, req) {
    return fetch(methods.GET, path, req)
}

async function put(path, req) {
    return fetch(methods.PUT, path, req)
}

async function post(path, req) {
    return fetch(methods.POST, path, req)
}

async function del(path, req) {
    return fetch(methods.DELETE, path, req)
}

async function fetch(method, path, req) {
    let token = ""
    try {
        token = await getStoreValue("token")
    } catch (error) {
        console.log("SERVICE: failed fetching token from store", error)
    }

    const request = {
        path: path,
        method: method,
        headers: {"x-auth-token": token},
		...req
    }

    console.log("SERVICE: req", req)
    const result = await window["http"].fetch(request)
    console.log("SERVICE: result", result)
    return result
}

export {
    get,
    post,
    put,
    del
}
