import React, { useEffect, useState } from 'react';
import MetaData from '../layouts/MetaData';
import "./ProductList.css";
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import Sidebar from './Sidebar';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDeleteProductAdminMutation, useGetAllProductsAdminQuery } from '../../redux/services/product';
import { showErrorMessage } from '../../utils/showErrorMessage';
import { showSuccessMessage } from "../../utils/successMessage"



const ProductList = () => {

    const [rows, setRow] = useState([])
    const { data: products, isSuccess, isError: isAdminlistError, error: adminError } = useGetAllProductsAdminQuery();

    const [deleteProduct, { isError: isDeleteError, isLoading: isDeleteLoading, isSuccess: isDeleteSuccess, error: deleteError }] = useDeleteProductAdminMutation();

    const deleteProductHandler = (id) => {
        deleteProduct(id);
    };


    useEffect(() => {
        if (isSuccess && products) {
            const transformData = products && products?.products?.map((item) => {

                return {
                    id: item._id,
                    stock: item.stock,
                    price: item.price,
                    name: item.name,
                }
            })
            setRow(transformData)
        }

        if (isAdminlistError) {
            showErrorMessage(adminError)
        }

        if (isDeleteError) {
            showErrorMessage(deleteError)
        }

    }, [products, isSuccess, isAdminlistError, adminError, isDeleteError, deleteError, isDeleteSuccess])

    useEffect(() => {
        if (isDeleteSuccess) {
            showSuccessMessage("Product deleted successfully")
        }
    }, [isDeleteSuccess])

    const columns = [
        { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5 },

        {
            field: "name",
            headerName: "Name",
            minWidth: 350,
            flex: 1,
        },
        {
            field: "stock",
            headerName: "Stock",
            type: "number",
            minWidth: 150,
            flex: 0.3,
        },

        {
            field: "price",
            headerName: "Price",
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
                        <Link to={`/admin/product/${params.row.id}`}>
                            <EditIcon />
                        </Link>

                        <Button
                            disabled={isDeleteLoading}
                            onClick={() =>
                                deleteProductHandler(params.row.id)
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
            <MetaData title={`ALL PRODUCTS - Admin`} />

            <div className="dashboard">
                <Sidebar />
                <div className="productListContainer">
                    <h1 id="productListHeading">ALL PRODUCTS</h1>

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

export default ProductList
