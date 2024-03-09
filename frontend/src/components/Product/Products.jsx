import React, { useEffect, useState } from 'react'
import { useGetAllProductsQuery } from '../../redux/services/product'
import Loader from '../layouts/Loader/Loader'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import MetaData from '../layouts/MetaData'
import ProductCard from '../Home/ProductCard'
import { Pagination, Typography } from '@mui/material'
import Slider from '@mui/material/Slider';
import "./Products.css"


const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
    "TV"
];





const Products = () => {
    const { keyword } = useParams()
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 1000000]);
    const [category, setCategory] = useState("");
    const [ratings, setRatings] = useState(0)
    const { data, isLoading, error, refetch } = useGetAllProductsQuery({ keyword, currentPage, price, category, ratings })


    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const priceHandler = (e, newValue) => {
        setPrice(newValue)
    }

    useEffect(() => {
        if (error) {
            getErrorMessage(error)
        }
    }, [error])

    useEffect(() => {
        // Refetch data whenever currentPage changes
        refetch();
    }, [currentPage, price, category, ratings, refetch]);


    let count = data && data.filteredProductsCount;

    return (
        <>
            {isLoading ?
                (<Loader />) :

                (<>
                    <MetaData title="PRODUCTS -- ECOMMERCE" />
                    <h2 className="productsHeading">Products</h2>

                    <div className="products">
                        {data && data.products &&
                            data.products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                    </div>

                    <div className='filterBox'>
                        <Typography>Price</Typography>
                        <Slider
                            getAriaLabel={() => 'Temperature range'}
                            value={price}
                            onChange={priceHandler}
                            valueLabelDisplay="auto"
                            min={0}
                            max={100000}
                        />

                        <Typography>Categories</Typography>
                        <ul className="categoryBox">
                            {categories.map((category) => (
                                <li
                                    className="category-link"
                                    key={category}
                                    onClick={() => setCategory(category)}
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>

                        <fieldset>
                            <Typography component="legend">Ratings Above</Typography>
                            <Slider
                                value={ratings}
                                onChange={(e, newRating) => {
                                    setRatings(newRating);
                                }}
                                aria-labelledby="continuous-slider"
                                valueLabelDisplay="auto"
                                min={0}
                                max={5}
                            />
                        </fieldset>

                    </div>

                    {data?.productsCount > 0 && data?.resultPerPage < data.productsCount &&
                        <Pagination
                            count={(Math.ceil(data && data?.productsCount / data?.resultPerPage))}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
                            showFirstButton={true}
                            showLastButton={true}
                        />
                    }

                </>)
            }

        </>
    )
}

export default Products
