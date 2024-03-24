import React, { useEffect, useState } from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import Sidebar from "./Sidebar";
import { Button } from "@mui/material";
import Loader from "../layouts/Loader/Loader";
import MetaData from "../layouts/MetaData";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserDetailAdminQuery, useUpdateUserMutation } from "../../redux/services/user";
import { showErrorMessage } from "../../utils/showErrorMessage";
import { showSuccessMessage } from "../../utils/successMessage";


const UpdateUser = () => {
    const { id } = useParams();
    const navigate = useNavigate()
    const { data: userDetail, isLoading: loading, error } = useGetUserDetailAdminQuery(id);
    const [updateUser, { isSuccess: isUpdated, error: updateError, isLoading: updateLoading }] = useUpdateUserMutation()
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");



    useEffect(() => {
        if (userDetail) {
            setName(userDetail.user.name);
            setEmail(userDetail.user.email);
            setRole(userDetail.user.role);
        }
        if (error) {
            showErrorMessage(error)
        }

        if (updateError) {
            alert.error(updateError);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            showSuccessMessage("User Updated Successfully");
            navigate("/admin/users");
        }
    }, [userDetail, isUpdated, error, updateError]);

    const updateUserSubmitHandler = (e) => {
        e.preventDefault();

        const data = {
            name, email, role
        }

        updateUser({ id, data });
    }

    return (
        <>
            <MetaData title="Update User" />
            <div className="dashboard">
                <Sidebar />
                <div className="newProductContainer">
                    {loading ? (
                        <Loader />
                    ) : (
                        <form
                            className="createProductForm"
                            onSubmit={updateUserSubmitHandler}
                        >
                            <h1>Update User</h1>

                            <div>
                                <PersonIcon />
                                <input
                                    type="text"
                                    placeholder="Name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <MailOutlineIcon />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <VerifiedUserIcon />
                                <select value={role} onChange={(e) => setRole(e.target.value)}>
                                    <option value="">Choose Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                            </div>

                            <Button
                                id="createProductBtn"
                                type="submit"
                                disabled={
                                    updateLoading ? true : false || role === "" ? true : false
                                }
                            >
                                Update
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </>
    )
}

export default UpdateUser
