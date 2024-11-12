import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PlaceOrder = () => {
  const {getTotalCartAmount,token,food_list,cartItems,url}=useContext(StoreContext);
 
  const [data,setData]=useState({
    firstname:"",
    lastname:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:""
  })

  const onChangeHandler=(event)=>{
    const name=event.target.name;
    const value=event.target.value;
    setData(data=>({...data,[name]:value}))
  }

  const placeOrder=async(event)=>{
    event.preventDefault();
    
    let orderItems=[];

    food_list.map((item)=>{
      if(cartItems[item._id]>0){
        let itemInfo=item;
        itemInfo["quantity"]=cartItems[item._id];
        orderItems.push(itemInfo)
      }
    })
    let orderData={
      address:data,
      items:orderItems,
      amount:getTotalCartAmount()+30,
    }
    let response=await axios.post(url+"/api/order/place",orderData,{headers:{token}});
    if(response.data.success){
      alert("Order placed")
      navigate("/myorders");
      
      toast.success(response.data.message)
    }else{
      alert("Not Valid")
    }
  }
  




  const navigate=useNavigate();
  useEffect(()=>{
    if(!token){
      navigate('/cart')
    }
    else if(getTotalCartAmount()===0){navigate('/cart')}
  },[token])


  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-feilds">
          <input required name='firstname' onChange={onChangeHandler} value={data.firstname} type="text" placeholder='First name' />
          <input required name='lastname' onChange={onChangeHandler} value={data.lastname} type="text" placeholder='Last name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street'/>
        <div className="multi-feilds">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='city' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>
        <div className="multi-feilds">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
      </div>

      <div className="place-order-right">
      <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-detail">
              <p>Subtotal</p>
              <p>Rs.{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-detail">
              <p>Delivery Fee</p>
              <p>Rs.{getTotalCartAmount()===0?0:30}</p>
            </div>
            <hr />
            <div className="cart-total-detail">
              <p>Total</p>
              <p>Rs.{getTotalCartAmount()===0?0:getTotalCartAmount()+30}</p>
            </div>
          </div>
          <div className='placeorder-right'> 
            <div className='placeorder-right-content'>
              <p>CASH ON DELIVERY</p>
            </div>
          </div>
          <button type='submit'>PLACE ORDER</button>
        </div>
        
      </div>
    </form>
  )
}

export default PlaceOrder
