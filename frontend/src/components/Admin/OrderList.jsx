
import React, { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Sidebar from "./Sidebar";
import MetaData from "../layouts/MetaData";
import { useAllOrderAdminQuery, useDeleteOrderMutation } from "../../redux/services/order";
import { Button } from "@mui/material";
import { showErrorMessage } from "../../utils/showErrorMessage";
import { showSuccessMessage } from "../../utils/successMessage";

const OrderList = () => {


    const { data: orders } = useAllOrderAdminQuery();

    const [deleteOrder, { isError: isDeleteError, isSuccess: isDeleteSuccess, error: deleteError, isLoading: isDeleteLoading }] = useDeleteOrderMutation();

    const [rows, setRow] = useState([]);


    const deleteOrderHandler = (id) => {
        deleteOrder(id)
    };

    useEffect(() => {
        if (orders) {
            const result = orders.orders.map((itm) => {
                return ({
                    id: itm._id,
                    itemsQty: itm.orderItems.length,
                    amount: itm.totalPrice,
                    status: itm.orderStatus,
                })

            })
            setRow(result)
        }

        if (isDeleteError) {
            showErrorMessage(deleteError)
        }
        if (isDeleteSuccess) {
            showSuccessMessage("Order deleted successfully")
        }

    }, [orders, isDeleteError, deleteError, isDeleteSuccess])

    const columns = [
        { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },

        {
            field: "status",
            headerName: "Status",
            minWidth: 150,
            flex: 0.5,
            cellClassName: (params) => {
                return params.row.status === "Delivered"
                    ? "greenColor"
                    : "redColor";
            },
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 150,
            flex: 0.4,
        },

        {
            field: "amount",
            headerName: "Amount",
            type: "number",
            minWidth: 270,
            flex: 0.5,
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
                        <Link to={`/admin/order/${params.row.id}`}>
                            <EditIcon />
                        </Link>

                        <Button
                            disabled={isDeleteLoading}
                            onClick={() =>
                                deleteOrderHandler(params.row.id)
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
            <MetaData title={`ALL ORDERS - Admin`} />

            <div className="dashboard">
                <Sidebar />
                <div className="productListContainer">
                    <h1 id="productListHeading">ALL ORDERS</h1>

                    <DataGrid
                        rows={rows}
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

export default OrderList
