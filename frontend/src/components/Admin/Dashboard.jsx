import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar';
import "./Dashboard.css";
import MetaData from '../layouts/MetaData';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useGetAllProductsAdminQuery } from '../../redux/services/product';
import { useAllOrderAdminQuery } from '../../redux/services/order';
import { useGetAllUserListAdminQuery } from '../../redux/services/user';
// import { Doughnut, Line } from "react-chartjs-2";
import { LineChart, Line, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
// XAxis 
// CartesianGrid 

const Dashboard = () => {

    const { data: products } = useGetAllProductsAdminQuery();

    const { data: orders } = useAllOrderAdminQuery();

    const { data: users } = useGetAllUserListAdminQuery()
    const [outOfStock, setOutOfStock] = useState(0)

    useEffect(() => {
        if (products) {
            const result = products.products?.filter((itm) => itm.stock === 0);
            setOutOfStock(result ? result.length : 0);
        }
    }, [products]);

    // const lineState = {
    //     labels: ["Initial Amount", "Amount Earned"],
    //     datasets: [
    //         {
    //             label: "TOTAL AMOUNT",
    //             backgroundColor: ["tomato"],
    //             hoverBackgroundColor: ["rgb(197, 72, 49)"],
    //             data: [0, orders && orders.totalAmount],
    //         },
    //     ],
    // };

    // const doughnutState = {
    //     labels: ["Out of Stock", "InStock"],
    //     datasets: [
    //         {
    //             backgroundColor: ["#00A6B4", "#6800B4"],
    //             hoverBackgroundColor: ["#4B5000", "#35014F"],
    //             data: [outOfStock, products && products.products.length - outOfStock],
    //         },
    //     ],
    // };


    const lineData = [
        { name: 'Initial Amount', value: 0 },
        { name: 'Amount Earned', value: orders && orders.totalAmount }
    ];

    const doughnutData = [
        { name: 'Out of Stock', value: outOfStock },
        { name: 'In Stock', value: products && products.products.length - outOfStock }
    ];

    const data = [
        {
            "name": "Intail Amount",
            "amount": 0,
            // "amt": 2400
        },
        {
            "name": "Amount Earned",
            "amount": orders && orders.totalAmount,
            // "amt": 2210
        },



    ]


    return (
        <>
            <div className="dashboard">
                <MetaData title="Dashboard - Admin Panel" />
                <Sidebar />

                <div className="dashboardContainer">
                    <Typography component="h1">Dashboard</Typography>

                    <div className="dashboardSummary">
                        <div>
                            <p>
                                Total Amount <br /> ₹{orders && orders.totalAmount}
                            </p>
                        </div>
                        <div className="dashboardSummaryBox2">
                            <Link to="/admin/products">
                                <p>Product</p>
                                <p>{products && products.products && products.products.length}</p>
                            </Link>
                            <Link to="/admin/orders">
                                <p>Orders</p>
                                <p>{orders && orders.orders.length}</p>
                            </Link>
                            <Link to="/admin/users">
                                <p>Users</p>
                                <p>{users && users.users.length}</p>
                            </Link>
                        </div>
                    </div>

                    <LineChart width={730} height={250} data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />

                        <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
                    </LineChart>

                    <div style={{ border: "2px solid red" }} className="doughnutChar">
                        <PieChart width={400} height={200}>
                            <Pie data={doughnutData} dataKey="value" nameKey="name" cx="50%" cy="50%" label outerRadius={100}>
                                {
                                    doughnutData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? "#00A6B4" : "#6800B4"} />
                                    ))
                                }
                                <Tooltip />
                                <Legend />
                            </Pie>
                        </PieChart>

                    </div>

                    {/* <div className="lineChart">
                        <LineChart width={400} height={200} data={lineData}>
                            <Line type="monotone" dataKey="value" stroke="#8884d8" />
                        </LineChart>
                    </div>

               
                     */}
                </div>
            </div>

        </>
    )
}

export default Dashboard
