import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { API_URL } from "../constans/API";

const ProductDetail = ({ userGlobal }) => {
    const { productId } = useParams();
    const [productData, setProductData] = useState({});
    const [productNotFound, setProductNotFound] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const fetchProductData = () => {
        Axios.get(`${API_URL}/products`, {
            params: {
                id: productId,
            },
        })
        .then((result) => {
            if (result.data.length > 0) {
                setProductData(result.data[0]);
                setProductNotFound(false);
            } else {
                setProductNotFound(true);
            }
        })
        .catch(() => {
            alert("Terjadi kesalahan di server");
        });
    };

    useEffect(() => {
        fetchProductData();
    }, []);

    const qtyBtnHandler = (action) => {
        if (action === "increment") {
            setQuantity((prevQty) => prevQty + 1);
        } else if (action === "decrement" && quantity > 1) {
            setQuantity((prevQty) => prevQty - 1);
        }
    };

    const addToCartHandler = () => {
        // if (!userGlobal.id) {
        //     alert("Anda harus login terlebih dahulu");
        //     return;
        // }

        Axios.get(`${API_URL}/carts`, {
            params: {
                userId: userGlobal.id,
                productId: productData.id,
            }
        })
        .then((result) => {
            if (result.data.length) {
                Axios.patch(`${API_URL}/carts/${result.data[0].id}`, {
                    quantity: result.data[0].quantity + quantity
                })
                .then(() => {
                    alert ("Berhasil menambahkan barang")
                })
                .catch(() => {
                    alert("Terjadi kesalahan")
                })
            } else {
                Axios.post(`${API_URL}/carts`, {
                    userId: userGlobal.id,
                    productId: productData.id,  // Pastikan bahwa properti ini benar
                    price: productData.price,
                    productName: productData.productName,
                    productImage: productData.productImage,
                    quantity: quantity,
                })
                .then(() => {
                    alert("Berhasil menambahkan barang");
                })
                .catch(() => {
                    alert("Terjadi kesalahan");
                });
            }
        })
    };

    if (productNotFound) {
        return <h3>Product not found</h3>;
    }

    return (
        <div className="container">
            <div className="row mt-3">
                <div className="col-6">
                    <img
                        style={{ width: "100%" }}
                        src={productData.productImage}
                        alt=""
                    />
                </div>
                <div className="col-6 d-flex flex-column justify-content-center">
                    <h4>{productData.productName}</h4>
                    <h5>Rp {productData.price}</h5>
                    <p>{productData.description}</p>
                    <div className="d-flex flex-row align-items-center">
                        <button 
                            className="btn btn-primary mr-4"
                            onClick={() => qtyBtnHandler("decrement")}
                        >
                            -
                        </button>
                        {quantity}
                        <button 
                            className="btn btn-primary mx-4"
                            onClick={() => qtyBtnHandler("increment")}
                        >
                            +
                        </button>
                    </div>
                    <button onClick={addToCartHandler} className="btn btn-success mt-3">
                        Add to cart
                    </button>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userGlobal: state.user,
    };
};

export default connect(mapStateToProps)(ProductDetail);
