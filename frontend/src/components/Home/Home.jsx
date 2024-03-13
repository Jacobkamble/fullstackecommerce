import React, { useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import ProductCard from "./ProductCard.jsx";
import { useGetAllProductsQuery } from "../../redux/services/product.js"
import MetaData from "../layouts/MetaData.jsx";
import Loader from "../layouts/Loader/Loader.jsx";
import { showErrorMessage } from "../../utils/showErrorMessage.js";
const Home = () => {
    const { isLoading, data, isError, error } = useGetAllProductsQuery({ currentPage: 1, });
    useEffect(() => {
        if (isError) {
            showErrorMessage(error)
        }
    }, [isError])


    return (
        <>
            {isLoading ? (
                <Loader />

            ) : (
                <>
                    <MetaData title="ECOMMERCE" />
                    <div className="banner">
                        <p>Welcome to Ecommerce</p>
                        <h1>FIND AMAZING PRODUCTS BELOW</h1>

                        <a href="#container">
                            <button>
                                Scroll <CgMouse />
                            </button>
                        </a>
                    </div>

                    <h2 className="homeHeading">Featured Products</h2>

                    <div className="container" id="container">
                        {data &&
                            data?.products?.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                    </div>
                </>
            )}
        </>
    );
};

export default Home;