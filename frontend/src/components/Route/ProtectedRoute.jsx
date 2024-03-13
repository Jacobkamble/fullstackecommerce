import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import { useLoadUserQuery } from '../../redux/services/user';



const ProtectedRoute = ({ children, loading, user, isAdmin }) => {
    const { isAuthenticated } = useSelector(state => state.auth);

    const { data, isLoading, } = useLoadUserQuery();

    return (
        <>
            {
                !isLoading && (!isAuthenticated ? <Navigate to={"/login"} /> : isAdmin === true && data?.user?.role !== "admin" ? <Navigate to={"/login"} /> : children)
            }

        </>
    )
}

export default ProtectedRoute 
