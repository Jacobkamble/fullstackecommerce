import React, { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";
import MetaData from "../layouts/MetaData";
import Loader from "../layouts/Loader/Loader";
import { useLoadUserQuery } from "../../redux/services/user";

const Profile = () => {
    const navigate = useNavigate()
    const { isAuthenticated } = useSelector(state => state.auth)
    const { data, isLoading } = useLoadUserQuery();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <MetaData title={`${data?.user.name}'s Profile`} />
                    <div className="profileContainer">
                        <div>
                            <h1>My Profile</h1>
                            <img src={data?.user.avatar.url} alt={data?.user.name} />
                            <Link to="/me/update">Edit Profile</Link>
                        </div>
                        <div>
                            <div>
                                <h4>Full Name</h4>
                                <p>{data?.user.name}</p>
                            </div>
                            <div>
                                <h4>Email</h4>
                                <p>{data?.user.email}</p>
                            </div>
                            <div>
                                <h4>Joined On</h4>
                                <p>{String(data?.user.createdAt).substr(0, 10)}</p>
                            </div>

                            <div>
                                <Link to="/orders">My Orders</Link>
                                <Link to="/password/update">Change Password</Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Profile;