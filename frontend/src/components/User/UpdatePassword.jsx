
import React, { useState, useEffect } from "react";
import "./UpdatePassword.css";
import MetaData from '../layouts/MetaData';
import Loader from '../layouts/Loader/Loader';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useUpdatePasswordMutation } from "../../redux/services/user";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const UpdatePassword = () => {

    const navigate = useNavigate();

    const [updatePassword, { isLoading, isSuccess, error, isError }] = useUpdatePasswordMutation();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")

    const updatePasswordSubmit = (e) => {
        e.preventDefault();

        updatePassword({ oldPassword, newPassword, confirmPassword })


    }

    useEffect(() => {

        if (isError) {
            getErrorMessage(error)
        }
        if (isSuccess) {
            toast.success("Password Changed Successfully");
            navigate("/account")
        }
    },
        [isError, error, isSuccess])


    return (


        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <MetaData title="Change Password" />
                    <div className="updatePasswordContainer">
                        <div className="updatePasswordBox">
                            <h2 className="updatePasswordHeading">Update Profile</h2>

                            <form
                                className="updatePasswordForm"
                                onSubmit={updatePasswordSubmit}
                            >
                                <div className="loginPassword">
                                    <VpnKeyIcon />
                                    <input
                                        type="password"
                                        placeholder="Old Password"
                                        required
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                </div>

                                <div className="loginPassword">
                                    <LockOpenIcon />
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div className="loginPassword">
                                    <LockIcon />
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                <input
                                    type="submit"
                                    value="Change"
                                    className="updatePasswordBtn"
                                />
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>

    )
}

export default UpdatePassword
