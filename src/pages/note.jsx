const addToCartHandler = () => {
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