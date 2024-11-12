import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
    
    const { url, token,currency,food_list} = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrder = async () => {
        const response = await axios.post(url + "/api/order/userorders", {}, {
            headers: { token }
        });
        setData(response.data.data);
        console.log(response.data.data);
    }

    useEffect(() => {
        if (token) {
            fetchOrder();
        }
    }, [token]);

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className="container">
                {data.map((order, index) => {
                    return (
                        <div className="my-orders-order" key={index}>
                            <img src={assets.parcel_icon} alt="parcel icon" />
                            <p>
                                {order.items.map((item, idx) => (
                                    `${item.name} x ${item.quantity}${idx !== order.items.length - 1 ? ', ' : ''}`
                                ))}
                            </p>
                            <p>Rs. {order.amount}.00</p>
                            <p>Items: {order.items.length}</p>
                            <p><span>&#x25cf;</span> <b>{order.status}</b></p>

                            <button onClick={fetchOrder} className='track-button'>Track Order</button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MyOrders;
