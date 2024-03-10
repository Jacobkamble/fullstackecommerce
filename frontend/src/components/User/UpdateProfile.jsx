import React, { useEffect, useState } from 'react';
import MetaData from '../layouts/MetaData';
import Loader from '../layouts/Loader/Loader';
import "./UpdateProfile.css";
import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useUpdateProfileMutation } from '../../redux/services/user';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = ({ user, refetch }) => {

    const navigate = useNavigate()

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState();
    const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

    const [updateProfile, { isError, isLoading, error, isSuccess }] = useUpdateProfileMutation()


    const updateProfileSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("avatar", avatar);
        updateProfile(myForm);
    };

    const updateProfileDataChange = (e) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
                console.log(reader.result, "result")
                setAvatar(reader.result);
            }
        };

        reader.readAsDataURL(e.target.files[0]);
    };

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar.url);
        }

        if (isError) {
            getErrorMessage(error)
        }

        if (isSuccess) {
            toast.success("Profile Updated Successfully");
            refetch()
            navigate("/account");

            // dispatch({
            //     type: UPDATE_PROFILE_RESET,
            // });
        }

    }, [user, isError, error, isSuccess]);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <MetaData title="Update Profile" />
                    <div className="updateProfileContainer">
                        <div className="updateProfileBox">
                            <h2 className="updateProfileHeading">Update Profile</h2>

                            <form
                                className="updateProfileForm"
                                encType="multipart/form-data"
                                onSubmit={updateProfileSubmit}
                            >
                                <div className="updateProfileName">
                                    <FaceOutlinedIcon />
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        required
                                        name="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="updateProfileEmail">
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

                                <div id="updateProfileImage">
                                    <img src={avatarPreview} alt="Avatar Preview" />
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        onChange={updateProfileDataChange}
                                    />
                                </div>
                                <input
                                    type="submit"
                                    value="Update"
                                    className="updateProfileBtn"
                                />
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default UpdateProfile
