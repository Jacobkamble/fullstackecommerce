import React, { useEffect, useState } from 'react';
import MetaData from '../layouts/MetaData';
import Loader from '../layouts/Loader/Loader';
import "./UpdateProfile.css";
import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useLoadUserQuery, useUpdateProfileMutation } from '../../redux/services/user';
import { showErrorMessage } from '../../utils/showErrorMessage';
import { useNavigate } from 'react-router-dom';
import { showSuccessMessage } from '../../utils/successMessage';

const UpdateProfile = ({ user }) => {

    const { data, refetch } = useLoadUserQuery();

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
        if (data?.user) {
            setName(data?.user.name);
            setEmail(data?.user.email);
            setAvatarPreview(data?.user.avatar.url);
        }

        if (isError) {
            showErrorMessage(error)
        }

        if (isSuccess) {
            showSuccessMessage("Profile Updated Successfully")
            refetch()
            navigate("/account");
        }

    }, [data, isError, error, isSuccess]);

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
