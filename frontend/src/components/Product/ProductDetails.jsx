import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetProductDetailsQuery } from '../../redux/services/product';
import Loader from '../layouts/Loader/Loader';
import MetaData from '../layouts/MetaData';
import Rating from '@mui/material/Rating';
import "./ProductDetails.css"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import { useEffect } from 'react';
import { showSuccessMessage } from '../../utils/successMessage';
import ReviewCard from './ReviewCard';
import { useDispatch } from 'react-redux';
import { addItemsToCart } from '../../redux/features/cart';
import { toast } from 'react-toastify';
import { showErrorMessage } from '../../utils/showErrorMessage';



const ProductDetails = () => {

    const { id } = useParams();
    const dispatch = useDispatch()
    const { data, isLoading, isError, error } = useGetProductDetailsQuery(id);

    useEffect(() => {
        if (isError) {
            showErrorMessage(error)
        }
    }, [error])

    const options = {
        size: "large",
        value: data?.product.ratings,
        readOnly: true,
        precision: 0.5,
    };

    const [quantity, setQuantity] = useState(1);

    const increaseQuantity = () => {
        if (data && (data?.product?.stock <= quantity)) {
            return
        }
        setQuantity(quantity + 1)
    }

    const decreaseQuantity = () => {
        if (quantity <= 1) {
            return
        }
        setQuantity(quantity - 1)
    }

    const addToCartHandler = () => {
        dispatch(addItemsToCart(id, quantity));
        showSuccessMessage("Item Added To Cart")
    }


    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <MetaData title={`${data?.product?.name} -- ECOMMERCE`} />

                    <div className="ProductDetails">
                        <div >

                            <Swiper

                                modules={[Navigation, Pagination, Scrollbar, A11y, EffectCoverflow,]}
                                spaceBetween={50}
                                slidesPerView={1}
                                loop={true}
                                pagination={{ clickable: true }}
                                navigation={true}
                                className='mySwiper'
                                effect='coverflow'
                                grabCursor={true}
                                centeredSlides={true}
                                coverflowEffect={{
                                    rotate: 0,
                                    stretch: 0,
                                    depth: 100,
                                    modifier: 2.5
                                }}
                                zoom={{
                                    maxRatio: 3,
                                    toggle: true
                                }}
                            >
                                {data && data?.product.images &&
                                    data?.product.images.map((item, i) => (
                                        <SwiperSlide key={i}>
                                            <img

                                                className="CarouselImage"
                                                key={i}
                                                src={item.url}
                                                alt={`${i} Slide`}
                                            />
                                        </SwiperSlide>
                                    ))}
                            </Swiper>

                        </div>

                        <div>
                            <div className="detailsBlock-1">
                                <h2>{data?.product.name}</h2>
                                <p>Product # {data?.product._id}</p>
                            </div>
                            <div className="detailsBlock-2">
                                <Rating {...options} />
                                <span className="detailsBlock-2-span">
                                    {" "}
                                    ({data?.product.noOfReviews} Reviews)
                                </span>
                            </div>
                            <div className="detailsBlock-3">
                                <h1>{`₹${data?.product.price}`}</h1>
                                <div className="detailsBlock-3-1">
                                    <div className="detailsBlock-3-1-1">
                                        <button
                                            onClick={decreaseQuantity}
                                        >-</button>
                                        <input readOnly type="number"
                                            value={quantity}
                                        />
                                        <button
                                            onClick={increaseQuantity}
                                        >+</button>
                                    </div>
                                    <button
                                        disabled={data?.product.Stock < 1 ? true : false}
                                        onClick={addToCartHandler}
                                    >
                                        Add to Cart
                                    </button>
                                </div>

                                <p>
                                    Status:
                                    <b className={data?.product.Stock < 1 ? "redColor" : "greenColor"}>
                                        {data?.product.Stock < 1 ? "OutOfStock" : "InStock"}
                                    </b>
                                </p>
                            </div>

                            <div className="detailsBlock-4">
                                Description : <p>{data?.product.description}</p>
                            </div>

                            <button
                                // onClick={submitReviewToggle} 
                                className="submitReview">
                                Submit Review
                            </button>
                        </div>
                    </div>

                    <h3 className="reviewsHeading">REVIEWS</h3>

                    {/* <Dialog
                        aria-labelledby="simple-dialog-title"
                        open={open}
                        onClose={submitReviewToggle}
                    >
                        <DialogTitle>Submit Review</DialogTitle>
                        <DialogContent className="submitDialog">
                            <Rating
                                onChange={(e) => setRating(e.target.value)}
                                value={rating}
                                size="large"
                            />

                            <textarea
                                className="submitDialogTextArea"
                                cols="30"
                                rows="5"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={submitReviewToggle} color="secondary">
                                Cancel
                            </Button>
                            <Button onClick={reviewSubmitHandler} color="primary">
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog> */}

                    {data && data?.product.reviews && data?.product.reviews[0] ? (
                        <div className="reviews">
                            {data?.product.reviews &&
                                data?.product.reviews.map((review) => (
                                    <ReviewCard key={review._id} review={review} />
                                ))}
                        </div>
                    ) : (
                        <p className="noReviews">No Reviews Yet</p>
                    )}
                </>
            )}
        </>
    )
}

export default ProductDetails
