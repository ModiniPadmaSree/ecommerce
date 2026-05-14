import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Message from '../components/Message';
import styles from './CartPage.module.css';

const API = process.env.REACT_APP_API_URL;

const CartPage = () => {
  const { id: productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const qty = location.search
    ? Number(location.search.split('=')[1])
    : 1;

  // USER-BASED CART KEY
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const userId = userInfo?._id || 'guest';
  const cartKey = `cartItems_${userId}`;

  // LOAD CART
  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = localStorage.getItem(cartKey);
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ADD TO CART
  useEffect(() => {
    const addToCart = async () => {
      if (productId) {
        setLoading(true);

        try {
          const { data } = await axios.get(
            `${API}/api/v1/product/${productId}`
          );

          const newItem = {
            product: data.product._id,
            name: data.product.name,
            image: data.product.images[0].url,
            price: data.product.price,
            stock: data.product.stock,
            qty,
          };

          // GET LATEST CART
          const storedCartItems =
            JSON.parse(localStorage.getItem(cartKey)) || [];

          const existItem = storedCartItems.find(
            (x) => x.product === newItem.product
          );

          const updatedCartItems = existItem
            ? storedCartItems.map((x) =>
                x.product === existItem.product ? newItem : x
              )
            : [...storedCartItems, newItem];

          setCartItems(updatedCartItems);

          localStorage.setItem(
            cartKey,
            JSON.stringify(updatedCartItems)
          );

          setLoading(false);
        } catch (err) {
          setError(err.response?.data?.message || err.message);
          setLoading(false);
        }
      }
    };

    addToCart();
  }, [productId, qty, cartKey]);

  // RELOAD CORRECT USER CART
  useEffect(() => {
    const storedCartItems = localStorage.getItem(cartKey);

    setCartItems(
      storedCartItems ? JSON.parse(storedCartItems) : []
    );
  }, [cartKey]);

  // REMOVE ITEM
  const removeFromCartHandler = (id) => {
    const updatedCartItems = cartItems.filter(
      (x) => x.product !== id
    );

    setCartItems(updatedCartItems);

    localStorage.setItem(
      cartKey,
      JSON.stringify(updatedCartItems)
    );
  };

  // CHECKOUT
  const checkoutHandler = () => {
    const userInfo = localStorage.getItem('userInfo');

    if (userInfo) {
      navigate('/shipping');
    } else {
      navigate('/login?redirect=/shipping');
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.heading}>Shopping Cart</h1>

      {loading && <p>Adding to cart...</p>}

      {error && <Message type="error">{error}</Message>}

      {cartItems.length === 0 ? (
        <Message>
          Your cart is empty{' '}
          <Link to="/" className={styles.backLink}>
            Go Back
          </Link>
        </Message>
      ) : (
        <div className={styles.cartGrid}>
          <div className={styles.cartItems}>
            {cartItems.map((item) => (
              <div
                key={item.product}
                className={styles.cartItem}
              >
                <div className={styles.itemImage}>
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                </div>

                <div className={styles.itemInfo}>
                  <Link
                    to={`/product/${item.product}`}
                    className={styles.itemName}
                  >
                    {item.name}
                  </Link>

                  <p className={styles.itemPrice}>
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                <div className={styles.controls}>
                  <select
                    value={item.qty}
                    onChange={(e) => {
                      const updatedCartItems =
                        cartItems.map((x) =>
                          x.product === item.product
                            ? {
                                ...x,
                                qty: Number(e.target.value),
                              }
                            : x
                        );

                      setCartItems(updatedCartItems);

                      localStorage.setItem(
                        cartKey,
                        JSON.stringify(updatedCartItems)
                      );
                    }}
                    className={styles.qtySelect}
                  >
                    {[...Array(item.stock).keys()].map(
                      (x) => (
                        <option
                          key={x + 1}
                          value={x + 1}
                        >
                          {x + 1}
                        </option>
                      )
                    )}
                  </select>

                  <button
                    onClick={() =>
                      removeFromCartHandler(item.product)
                    }
                    className={styles.removeBtn}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summaryBox}>
            <h2 className={styles.summaryHeading}>
              Subtotal (
              {cartItems.reduce(
                (acc, item) => acc + item.qty,
                0
              )}
              ) items
            </h2>

            <div className={styles.total}>
              Total Price: $
              {cartItems
                .reduce(
                  (acc, item) =>
                    acc + item.qty * item.price,
                  0
                )
                .toFixed(2)}
            </div>

            <button
              onClick={checkoutHandler}
              className={styles.checkoutBtn}
              disabled={cartItems.length === 0}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;