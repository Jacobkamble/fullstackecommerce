
import React, { Fragment, useEffect, useState } from "react";

import "./ProductList.css";

import { Link, useNavigate } from "react-router-dom";



import Sidebar from './Sidebar';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// import { getAllUsers, clearErrors, deleteUser } from "../../actions/userAction";
// import { DELETE_USER_RESET } from "../../constants/userConstants";
import { Button } from "@mui/material";
import { showErrorMessage } from "../../utils/showErrorMessage";
import { showSuccessMessage } from "../../utils/successMessage";
import { useDeleteUserMutation, useGetAllUserListAdminQuery } from "../../redux/services/user";
import { DataGrid } from "@mui/x-data-grid";

const UserList = () => {
    const { data: users, error } = useGetAllUserListAdminQuery();
    const [row, setRow] = useState([])
    const [deleteUser, { error: deleteError, isSuccess }] = useDeleteUserMutation()

    const navigate = useNavigate()

    const deleteUserHandler = (id) => {
        deleteUser(id);
    };


    useEffect(() => {
        if (users) {

            const result = users && users.users?.map((item) => {
                return ({
                    id: item._id,
                    role: item.role,
                    email: item.email,
                    name: item.name,
                })
            })

            setRow(result)
        }

        if (error) {
            showErrorMessage(error)
        }

        if (deleteError) {
            showErrorMessage(deleteError)

        }

        if (isSuccess) {
            showSuccessMessage("User deleted succesfully")
            navigate("/admin/users");

        }


    }, [users, isSuccess, deleteError, error])

    const columns = [
        { field: "id", headerName: "User ID", minWidth: 180, flex: 0.8 },

        {
            field: "email",
            headerName: "Email",
            minWidth: 200,
            flex: 1,
        },
        {
            field: "name",
            headerName: "Name",
            minWidth: 150,
            flex: 0.5,
        },

        {
            field: "role",
            headerName: "Role",
            type: "number",
            minWidth: 150,
            flex: 0.3,
            cellClassName: (params) => {
                return params.row.role === "admin"
                    ? "greenColor"
                    : "redColor";
            },
        },

        {
            field: "actions",
            flex: 0.3,
            headerName: "Actions",
            minWidth: 150,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={`/admin/user/${params.row.id}`}>
                            <EditIcon />
                        </Link>

                        <Button
                            onClick={() =>
                                deleteUserHandler(params.row.id)
                            }
                        >
                            <DeleteIcon />
                        </Button>
                    </>
                );
            },
        },
    ];

    return (
        <>
            {/* <MetaData title={`ALL USERS - Admin`} />
             */}

            <div className="dashboard">
                <Sidebar />
                <div className="productListContainer">
                    <h1 id="productListHeading">ALL USERS</h1>

                    <DataGrid
                        rows={row}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className="productListTable"
                        autoHeight
                    />
                </div>
            </div>
        </>
    )
}

export default UserList
