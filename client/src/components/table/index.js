import React, { useState } from "react"
import TrashSvg from "../../assets/trash_svg.js"
import ConfirmationModal from "../confirmation_modal/index.js"

function Table(props) {
    const data = props.data

    const [open, setOpen] = useState(false)

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>{item.date}</td>
                            <td><TrashSvg onClick={() => setOpen(true)} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ConfirmationModal open={open} onClose={() => setOpen(false)} />
        </>
    )
}

export default Table

