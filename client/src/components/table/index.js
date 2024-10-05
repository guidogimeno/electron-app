import React, { useState } from "react"
import TrashSvg from "../../assets/trash_svg.js"
import ConfirmationModal from "../confirmation_modal/index.js"
import { Link } from "react-router-dom"

function Table(props) {
    const data = props.data

    const [open, setOpen] = useState(false)
    const [candidate, setCandidate] = useState(null)

    return (
        <div className="reports-table">
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Id Paciente</th>
                        <th>Edad</th>
                        <th>Descripcion</th>
                        <th>Fecha de creacion</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.id}>
                            <td className="name-td">
                                <Link to={`/my_hips/${item.id}`}>
                                    {item.name}
                                </Link>
                            </td>
                            <td>{item.idPatient}</td>
                            <td>{item.age}</td>
                            <td>{item.description}</td>
                            <td>{item.date}</td>
                            <td className="trash-td">
                                <TrashSvg onClick={() => {
                                    setCandidate(item.id)
                                    setOpen(true)
                                }} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ConfirmationModal
                open={open}
                onCancel={() => setOpen(false)}
                onConfirmation={() => {
                    props.handleDelete(candidate)
                    setOpen(false)
                }} >
                Estas seguro que queres eliminar este reporte?
            </ConfirmationModal>
        </div>
    )
}

export default Table

