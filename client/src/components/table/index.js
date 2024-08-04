import React, { useState } from "react"
import TrashSvg from "../../assets/trash_svg.js"
import ConfirmationModal from "../confirmation_modal/index.js"
import { Link } from "react-router-dom"

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
                            <td className="name-td">
                                <Link to="/analyze">
                                    {item.name}
                                </Link>
                            </td>
                            <td>{item.description}</td>
                            <td>{item.date}</td>
                            <td className="trash-td"><TrashSvg onClick={() => setOpen(true)} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ConfirmationModal open={open} onCancel={() => setOpen(false)} onConfirmation={() => console.log("confirmaron")} >
                Are you sure you want to delete this report?
            </ConfirmationModal>
        </>
    )
}

export default Table

