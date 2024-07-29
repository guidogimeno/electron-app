import React, { useContext, useState } from "react"
import Page from "../../components/page/index.js"
import Spinner from "../../components/spinner/index.js"
import { GlobalContext } from "../../context/index.js"
import Table from "../../components/table/index.js"
import Search from "../../components/search/index.js"

const data = [
    { id: 1, name: "Hola", description: "esta es la super descripcion", date: "2024-07-01" },
    { id: 2, name: "Saraza", description: "esta es la super descripcion", date: "2024-07-01" },
    { id: 3, name: "Mundo", description: "esta es la super descripcion", date: "2024-07-01" },
    { id: 4, name: "Niqui puto", description: "esta es la super descripcion", date: "2024-07-01" },
]

function Home() {
    const context = useContext(GlobalContext)

    const [tableData, setTableData] = useState(data)

    function handleSearch(value) {
        if (!value) {
            setTableData(data)
            return
        }

        const filteredItems = data.filter((item) => {
            return Object.values(item).some((field) => {
                if (typeof field !== "string") {
                    return false
                }
                return field.toLowerCase().includes(value.toLowerCase())
            })
        })

        setTableData(filteredItems)
    }

    function handleClick() {
        context.showNotification("hello world", "warning")
    }

    return (
        <Page>
            {false ? <Spinner /> :
                <>
                    <h1>Welcome to HipPal!</h1>
                    <Search onChange={handleSearch} />
                    <Table data={tableData} />
                </>
            }
        </Page>
    )
}

export default Home

