import React, { Fragment, useState, useEffect } from "react";
import "./ForgotPassword.css";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Loader from "../layouts/Loader/Loader";
import MetaData from '../layouts/MetaData';
import { useForgotPasswordMutation } from "../../redux/services/user";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";




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
            getErrorMessage(error)
        }
        if (isSuccess) {
            toast.success("Email sent successfully.");
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
