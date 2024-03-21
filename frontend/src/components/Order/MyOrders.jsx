import React, { useEffect, useState } from 'react';
import MetaData from '../layouts/MetaData';
import Loader from '../layouts/Loader/Loader';
import { Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import LaunchIcon from "@mui/icons-material/Launch";
import { useLoadUserQuery } from '../../redux/services/user';
import { useMyOrdersQuery } from '../../redux/services/order';
import { Link } from 'react-router-dom';
import "./MyOrders.css"
import { showErrorMessage } from '../../utils/showErrorMessage';



const MyOrders = () => {

    const [rows, setRows] = useState([]);

    const { data: userData } = useLoadUserQuery();

    const { data, isLoading, isSuccess, isError, error } = useMyOrdersQuery();

    useEffect(() => {

        if (isSuccess && data) {
            const transformData = data && data?.orders?.map((item) => {

                return {
                    itemsQty: item.orderItems.length,
                    id: item._id,
                    status: item.orderStatus,
                    amount: item.totalPrice,
                }
            })
            setRows(transformData)
        }

        if (isError) {
            showErrorMessage(error)
        }

    }, [data, , isError, error, isSuccess])

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
            flex: 0.3,
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
                    <Link to={`/order/${params.row.id}`}>
                        <LaunchIcon />
                    </Link>
                );
            },
        },
    ];
    return (
        <>
            <MetaData title={`${userData.user.name} - Orders`} />

            {isLoading ? (
                <Loader />
            ) : (
                <div className="myOrdersPage">
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className="myOrdersTable"
                        autoHeight
                    />

                    <Typography id="myOrdersHeading">{userData.user.name}'s Orders</Typography>
                </div>
            )}
        </>
    )
}

export default MyOrders
