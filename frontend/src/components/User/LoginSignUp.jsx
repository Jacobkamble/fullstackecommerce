import React, { useEffect, useState, useRef } from 'react'
import { useLoadUserQuery, useLoginMutation, useRegisterMutation } from '../../redux/services/user';
import { showErrorMessage } from '../../utils/showErrorMessage';
import Loader from '../layouts/Loader/Loader';
import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import { Link, useNavigate } from 'react-router-dom';
import "./LoginSignUp.css"
import { setAuth } from '../../redux/features/auth';
import { useDispatch, useSelector } from 'react-redux';
import { showSuccessMessage } from '../../utils/successMessage';

const LoginSignUp = () => {

    const { refetch, isSuccess } = useLoadUserQuery();

    const { isAuthenticated } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const loginTab = useRef(null);
    const registerTab = useRef(null);
    const switcherTab = useRef(null);

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [register, { isLoading: registerLoading, error: registerError, isError: isRegisterError, isSuccess: registerSuccess }] = useRegisterMutation();
    const [login, { isLoading: loginLoading, error: loginError, isError: isLoginError, isSuccess: loginSuccess }] = useLoginMutation();


    const { name, email, password } = user;

    const [avatar, setAvatar] = useState("/Profile.png");
    const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

    const registerDataChange = (e) => {
        if (e.target.name === "avatar") {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };

            reader.readAsDataURL(e.target.files[0]);
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    const loginSubmit = async (e) => {
        e.preventDefault();
        const res = (await login({ email: loginEmail, password: loginPassword }))?.data
        const { token } = res;
        localStorage.setItem("token", token)
        if (token) {
            dispatch(setAuth(true));
            refetch()
        }
    };

    const registerSubmit = async (e) => {
        e.preventDefault()

        const myData = new FormData();

        myData.append("name", name);
        myData.append("email", email);
        myData.append("password", password);
        myData.append("avatar", avatar);
        register(myData)
    }

    const switchTabs = (e, tab) => {
        if (tab === "login") {
            switcherTab.current.classList.add("shiftToNeutral");
            switcherTab.current.classList.remove("shiftToRight");

            registerTab.current.classList.remove("shiftToNeutralForm");
            loginTab.current.classList.remove("shiftToLeft");
        }
        if (tab === "register") {
            switcherTab.current.classList.add("shiftToRight");
            switcherTab.current.classList.remove("shiftToNeutral");

            registerTab.current.classList.add("shiftToNeutralForm");
            loginTab.current.classList.add("shiftToLeft");
        }
    };

    const redirect = location.search ? location.search.split("=")[1] : "/account";

    useEffect(() => {
        if (isLoginError) {
            showErrorMessage(loginError)
        }
        if (isRegisterError) {
            showErrorMessage(registerError)
        }
        if (isAuthenticated) {
            navigate(redirect)
        }
        if (loginSuccess) {
            showSuccessMessage("Login Successfully")
        }
        if (registerSuccess) {
            showSuccessMessage("Account Created Successfully")
        }

    }, [isLoginError, isRegisterError, isAuthenticated, loginSuccess, registerSuccess])


    return (
        <>

            {(loginLoading || registerLoading) ? (
                <Loader />
            ) : (
                <>
                    <div className="LoginSignUpContainer">
                        <div className="LoginSignUpBox">
                            <div>
                                <div className="login_signUp_toggle">
                                    <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                                    <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                                </div>
                                <button ref={switcherTab}></button>
                            </div>
                            <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                                <div className="loginEmail">

                                    <EmailOutlinedIcon />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                    />
                                </div>
                                <div className="loginPassword">

                                    <LockOpenOutlinedIcon />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        required
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                    />
                                </div>
                                <Link to="/password/forgot">Forget Password ?</Link>
                                <input type="submit" value="Login" className="loginBtn" />
                            </form>
                            <form
                                className="signUpForm"
                                ref={registerTab}
                                encType="multipart/form-data"
                                onSubmit={registerSubmit}
                            >
                                <div className="signUpName">

                                    <FaceOutlinedIcon />
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        required
                                        name="name"
                                        value={name}
                                        onChange={registerDataChange}
                                    />
                                </div>
                                <div className="signUpEmail">
                                    <EmailOutlinedIcon />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        name="email"
                                        value={email}
                                        onChange={registerDataChange}
                                    />
                                </div>
                                <div className="signUpPassword">

                                    <LockOpenOutlinedIcon />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        required
                                        name="password"
                                        value={password}
                                        onChange={registerDataChange}
                                    />
                                </div>

                                <div id="registerImage">
                                    <img src={avatarPreview} alt="Avatar Preview" />
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        onChange={registerDataChange}
                                    />
                                </div>
                                <input type="submit" value="Register" className="signUpBtn" />
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>


    )
}

export default LoginSignUp
