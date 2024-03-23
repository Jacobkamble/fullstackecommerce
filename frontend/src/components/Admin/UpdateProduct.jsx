import React, { useEffect,useState } from 'react';
import "./UpdateProduct.css";
import MetaData from '../layouts/MetaData';
import Sidebar from './Sidebar';
import { Button } from '@mui/material';
import { showErrorMessage } from '../../utils/showErrorMessage';
import { showSuccessMessage } from '../../utils/successMessage';
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DescriptionIcon from "@mui/icons-material/Description";
import StorageIcon from "@mui/icons-material/Storage";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useGetProductDetailsQuery, useUpdateProductMutation } from '../../redux/services/product';
import { useNavigate, useParams } from 'react-router-dom';



const UpdateProduct = () => {

    const {id} =useParams()

    const [updateProduct, { isLoading: loading, isError, isSuccess, error }] = useUpdateProductMutation();
    const {data:productDetails,isSuccess:isDetailsSuccess}=useGetProductDetailsQuery(id)
    const navigate=useNavigate();


  

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [oldImages, setOldImages] = useState([]);

    const categories = [
        "Laptop",
        "Footwear",
        "Bottom",
        "Tops",
        "Attire",
        "Camera",
        "SmartPhones",
    ];

    useEffect(() => {
        if (isSuccess) {
            showSuccessMessage("Product updated successfully");
            navigate("/admin/products")
        }

        if (isError) {
            showErrorMessage(error)
        }

     

    }, [isError, error, isSuccess])

    useEffect(()=>{
        if(isDetailsSuccess){
            setName(productDetails.product.name);
            setPrice(productDetails.product.price);
            setDescription(productDetails.product.description);
            setStock(productDetails.product.stock);
            setCategory(productDetails.product.category);
            // setImages(productDetails.product.images);
            // setImagesPreview(productDetails.product.images)
            setOldImages(productDetails. product.images);
        }
    },[isDetailsSuccess])

    console.log("name",name)

    const updateProductImagesChange = (e) => {
        const files = Array.from(e.target.files);

        setImages([]);
        setImagesPreview([]);

        files.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((old) => [...old, reader.result]);
                    setImages((old) => [...old, reader.result]);
                }
            };

            reader.readAsDataURL(file);
        });
    };

    const updateProductSubmitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("stock", stock);

        images.forEach((image) => {
            formData.append("images", image);
        });

        updateProduct({id,formData})
    }

  return (
    <>
    <MetaData title="Create Product" />
    <div className="dashboard">
      <Sidebar />
      <div className="newProductContainer">
        <form
          className="createProductForm"
          encType="multipart/form-data"
          onSubmit={updateProductSubmitHandler}
        >
          <h1>Update Product</h1>

          <div>
            <SpellcheckIcon />
            <input
              type="text"
              placeholder="Product Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <AttachMoneyIcon />
            <input
              type="number"
              placeholder="Price"
              required
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            />
          </div>

          <div>
            <DescriptionIcon />

            <textarea
              placeholder="Product Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              cols="30"
              rows="1"
            ></textarea>
          </div>

          <div>
            <AccountTreeIcon />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Choose Category</option>
              {categories.map((cate) => (
                <option key={cate} value={cate}>
                  {cate}
                </option>
              ))}
            </select>
          </div>

          <div>
            <StorageIcon />
            <input
              type="number"
              placeholder="Stock"
              required
              onChange={(e) => setStock(e.target.value)}
              value={stock}
            />
          </div>

          <div id="createProductFormFile">
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={updateProductImagesChange}
              multiple
            />
          </div>

          <div id="createProductFormImage">
            {oldImages &&
              oldImages.map((image, index) => (
                <img key={index} src={image.url} alt="Old Product Preview" />
              ))}
          </div>

          <div id="createProductFormImage">
            {imagesPreview.map((image, index) => (
              <img key={index} src={image} alt="Product Preview" />
            ))}
          </div>

          <Button
            id="createProductBtn"
            type="submit"
            disabled={loading ? true : false}
          >
            Update
          </Button>
        </form>
      </div>
    </div>
  </>
  )
}

export default UpdateProduct
