import React, { useState, useEffect } from "react";
import "./UpdatePassword.css";
import MetaData from '../layouts/MetaData';
import Loader from '../layouts/Loader/Loader';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import { useResetPasswordMutation } from "../../redux/services/user";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
    const navigate = useNavigate();
    const { token } = useParams();

    const [resetPassword, { isLoading, isSuccess, error, isError }] = useResetPasswordMutation()


    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")

    const resetPasswordSubmit = (e) => {
        e.preventDefault();
        resetPassword({ token, password, confirmPassword });
    }

    useEffect(() => {

        if (isError) {
            getErrorMessage(error)
        }
        if (isSuccess) {
            toast.success("Password Changed Successfully");
            navigate("/login")
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
                    <div className="resetPasswordContainer">
                        <div className="resetPasswordBox">
                            <h2 className="resetPasswordHeading">Update Profile</h2>

                            <form
                                className="resetPasswordForm"
                                onSubmit={resetPasswordSubmit}
                            >
                                <div>
                                    <LockOpenIcon />
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                                    value="Update"
                                    className="resetPasswordBtn"
                                />
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default ResetPassword
