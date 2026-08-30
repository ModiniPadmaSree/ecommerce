import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./OrderDetailsPage.module.css";

const API = process.env.REACT_APP_API_URL;

const OrderDetailsPage = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.get(
          `${API}/api/v1/order/${id}`,
          config
        );

        setOrder(data.order);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  /* =========================================
     LOADING / ERROR STATES
     ========================================= */

  if (loading) {
    return (
      <div className={styles.messagePage}>
        <div className={styles.messageCard}>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.messagePage}>
        <div className={styles.messageCard}>
          <h2>Order not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>

      <div className={styles.container}>

        {/* =====================================
            HEADING
            ===================================== */}

        <h2 className={styles.heading}>
          Order Details
        </h2>


        {/* =====================================
            ORDER SUMMARY
            ===================================== */}

        <div className={styles.orderSummary}>

          <div className={styles.infoItem}>
            <span>Order ID</span>
            <strong title={order._id}>
              {order._id}
            </strong>
          </div>


          <div className={styles.infoItem}>
            <span>Status</span>

            <strong className={styles.status}>
              {order.orderStatus}
            </strong>
          </div>


          <div className={styles.infoItem}>
            <span>Total Amount</span>

            <strong className={styles.totalAmount}>
              ${order.totalPrice}
            </strong>
          </div>

        </div>


        {/* =====================================
            SHIPPING INFORMATION
            ===================================== */}

        <section className={styles.section}>

          <h3>Shipping Information</h3>

          <div className={styles.infoGrid}>

            <p>
              <strong>Name</strong>
              <span>{order.user?.name || "—"}</span>
            </p>


            <p>
              <strong>Email</strong>
              <span>{order.user?.email || "—"}</span>
            </p>


            <p>
              <strong>Phone</strong>
              <span>
                {order.shippingInfo?.phoneNo || "—"}
              </span>
            </p>


            <p className={styles.fullWidth}>
              <strong>Address</strong>

              <span>
                {order.shippingInfo?.address || "—"}
                {order.shippingInfo?.city &&
                  `, ${order.shippingInfo.city}`}
                {order.shippingInfo?.state &&
                  `, ${order.shippingInfo.state}`}
                {order.shippingInfo?.country &&
                  `, ${order.shippingInfo.country}`}
                {order.shippingInfo?.pinCode &&
                  ` - ${order.shippingInfo.pinCode}`}
              </span>
            </p>

          </div>

        </section>


        {/* =====================================
            PAYMENT INFORMATION
            ===================================== */}

        <section className={styles.section}>

          <h3>Payment Information</h3>

          <div className={styles.infoGrid}>

            <p>
              <strong>Status</strong>

              <span
                className={
                  order.paymentInfo?.status === "succeeded"
                    ? styles.paid
                    : styles.notPaid
                }
              >
                {order.paymentInfo?.status === "succeeded"
                  ? "Paid"
                  : "Not Paid"}
              </span>
            </p>


            <p>
              <strong>Method</strong>

              <span>
                {order.paymentMethod || "—"}
              </span>
            </p>

          </div>

        </section>


        {/* =====================================
            ORDERED ITEMS
            ===================================== */}

        <section className={styles.section}>

          <h3>Ordered Items</h3>

          <div className={styles.itemsList}>

            {order.orderItems?.map((item) => (

              <div
                key={item._id}
                className={styles.item}
              >

                {/* PRODUCT IMAGE */}

                <div className={styles.itemImage}>

                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  ) : (
                    <div className={styles.noImage}>
                      No Image
                    </div>
                  )}

                </div>


                {/* PRODUCT DETAILS */}

                <div className={styles.itemDetails}>

                  <h4>
                    {item.name}
                  </h4>


                  <div className={styles.itemInfo}>

                    <p>
                      <span>Price</span>
                      ${item.price}
                    </p>


                    <p>
                      <span>Quantity</span>
                      {item.quantity}
                    </p>


                    <p>
                      <span>Total</span>

                      <strong>
                        ${item.price * item.quantity}
                      </strong>
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </section>

      </div>

    </div>
  );
};

export default OrderDetailsPage;