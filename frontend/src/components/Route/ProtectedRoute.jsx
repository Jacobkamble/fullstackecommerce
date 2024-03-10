import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Navigate } from 'react-router-dom';



const ProtectedRoute = ({ children, loading, user, isAdmin }) => {
    const { isAuthenticated } = useSelector(state => state.auth);

    return (
        <>
            {
                !loading && (!isAuthenticated ? <Navigate to={"/login"} /> : isAdmin === true && user.role !== "admin" ? <Navigate to={"/login"} /> : children)
            }

        </>
    )
}

export default ProtectedRoute 
