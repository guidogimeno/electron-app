import React, { useContext, useEffect, useState } from "react"
import Page from "../../components/page/index.js"
import Spinner from "../../components/spinner/index.js"
import { GlobalContext } from "../../context/index.js"
import Table from "../../components/table/index.js"
import Search from "../../components/search/index.js"
import { getReports, removeReport } from "../../fs/reports/index.js"

function MyHips() {
    const context = useContext(GlobalContext)

    const [reports, setReports] = useState([])
    const [tableData, setTableData] = useState([])

    useEffect(() => {
        fetchReports()
    }, [])

    async function fetchReports() {
        try {
            const reports = await getReports()
            setReports(reports)
            setTableData(reports)
        } catch (error) {
            context.showFailure(error.message)
        }
    }

    function handleSearch(value) {
        if (!value) {
            setTableData(reports)
            return
        }

        const filteredItems = reports.filter((item) => {
            return Object.values(item).some((field) => {
                if (typeof field !== "string") {
                    return false
                }
                return field.toLowerCase().includes(value.toLowerCase())
            })
        })

        setTableData(filteredItems)
    }

    async function handleDelete(id) {
        try {
            await removeReport(id)
            setReports(prevData => prevData.filter(report => report.id != id))
            setTableData(prevData => prevData.filter(report => report.id != id))
        } catch (error) {
            context.showFailure(error.message)
        }
    }

    return (
        <Page>
            {false ? <Spinner /> :
                <>
                    <h1>Welcome to HipPal!</h1>
                    <Search onChange={handleSearch} />
                    <Table data={tableData} handleDelete={handleDelete} />
                </>
            }
        </Page>
    )
}

export default MyHips

