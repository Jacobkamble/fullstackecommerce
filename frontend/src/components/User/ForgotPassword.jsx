import React, { useState, useEffect } from "react";
import "./ForgotPassword.css";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Loader from "../layouts/Loader/Loader";
import MetaData from '../layouts/MetaData';
import { useForgotPasswordMutation } from "../../redux/services/user";
import { showErrorMessage } from "../../utils/showErrorMessage";
import { useNavigate } from "react-router-dom";
import { showSuccessMessage } from "../../utils/successMessage";

const ForgotPassword = () => {

    const navigate = useNavigate();

    const [forgotPassword, { isLoading, isSuccess, isError, error }] = useForgotPasswordMutation();
    const [email, setEmail] = useState("");


    const forgotPasswordSubmit = (e) => {
        e.preventDefault();
        forgotPassword({ email })
    }

    useEffect(() => {
        if (isError) {
            showErrorMessage(error)
        }
        if (isSuccess) {
            showSuccessMessage("Email sent successfully.")
            navigate("/")
        }
    }, [isError, error, isSuccess])

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <MetaData title="Forgot Password" />
                    <div className="forgotPasswordContainer">
                        <div className="forgotPasswordBox">
                            <h2 className="forgotPasswordHeading">Forgot Password</h2>

                            <form
                                className="forgotPasswordForm"
                                onSubmit={forgotPasswordSubmit}
                            >
                                <div className="forgotPasswordEmail">
                                    <EmailOutlinedIcon />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <input
                                    type="submit"
                                    value="Send"
                                    className="forgotPasswordBtn"
                                />
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>

    )
}

export default ForgotPassword
