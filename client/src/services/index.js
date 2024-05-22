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
    return fetch(methods.GET, path, req)
}

async function post(path, req) {
    return fetch(methods.POST, path, req)
}

async function del(path, req) {
    return fetch(methods.GET, path, req)
}

async function fetch(method, path, req) {
    const req = {
        path: path,
        method: method,
        headers: req.headers,
        body: req.body
    }

    console.log("SERVICE: req", req)
    const result = await window["http"].fetch(req)
    console.log("SERVICE: result", result)
    return result
}

module.exports = {
    get,
    post,
    put,
    del
}
