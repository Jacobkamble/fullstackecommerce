import React, { useEffect, useState } from "react";
import "./Header.css";
import { SpeedDial, SpeedDialAction } from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from "react-router-dom";
import { useLogoutQuery } from "../../../redux/services/user";
import { useDispatch } from "react-redux";
import { setAuth } from "../../../redux/features/auth";
import { toast } from "react-toastify";


const UserOptions = ({ user, refetch }) => {


    const [skip, setSkip] = useState(true)
    const [open, setOpen] = useState(false);
    const { data, isLoading, } = useLogoutQuery({}, { skip })
    const dispatch = useDispatch();
    const navigate = useNavigate()


    const options = [
        { icon: <ListAltIcon />, name: "Orders", func: orders },
        { icon: <PersonIcon />, name: "Profile", func: account },
        {
            icon: (
                <ShoppingCartIcon
                // style={{ color: cartItems.length > 0 ? "tomato" : "unset" }}
                />
            ),
            // name: `Cart(${cartItems.length})`,
            name: "Cart",
            func: cart,
        },
        { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
    ];

    if (user?.role === "admin") {
        options.unshift({
            icon: <DashboardIcon />,
            name: "Dashboard",
            func: dashboard,
        });
    }

    function dashboard() {
        navigate("/admin/dashboard");
    }

    function orders() {
        navigate("/orders");
    }
    function account() {
        navigate("/account");
    }
    function cart() {
        navigate("/cart");
    }
    function logoutUser() {
        dispatch(setAuth(false))
        localStorage.removeItem("token")
        refetch()
        toast.success("Logout Successfully")
    }

    return (
        <>
            <Backdrop open={open} style={{ zIndex: "10" }} />
            <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                style={{ zIndex: "11" }}
                open={open}
                direction="down"
                className="speedDial"
                icon={
                    <img
                        className="speedDialIcon"
                        src={user?.avatar.url ? user?.avatar.url : "/Profile.png"}
                        // src={"/Profile.png"}
                        alt="Profile"
                    />
                }
            >
                {options.map((item) => (
                    <SpeedDialAction
                        key={item.name}
                        icon={item.icon}
                        tooltipTitle={item.name}
                        onClick={item.func}
                        tooltipOpen={window.innerWidth <= 600 ? true : false}
                    />
                ))}
            </SpeedDial>
        </>
    );
};

export default UserOptions;
