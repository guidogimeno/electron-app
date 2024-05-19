async function login(data) {
    const result = await window.electronAPI.fetch()
    console.log("resultados", result)
    // return axios.post("http://localhost:3000/logueate", data)
    //     .then(res => console.log(res.data))
    //     .catch(err => console.log(err))
}

module.exports = {
    login
}
