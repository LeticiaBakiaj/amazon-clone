import { Link ,useHistory} from "react-router-dom";
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState,useEffect, event } from 'react';
import CurrencyFormat from 'react-currency-format';
import CheckoutProduct from './CheckoutProduct';
import './Payment.css'
import { getBasketTotal } from './reducer';
import { useStateValue } from './StateProvider';
import axios from './axios';
import { db } from "./firebase";

function Payment() {

    const [{ basket, user}, dispatch] = useStateValue();
    const history=useHistory();

    const stripe= useStripe();
    const elements= useElements();

    const [succeeded, setSucceeded]= useState(false);
    const [processing, setProcessing]= useState("");
    const [error, setError]= useState(null);
    const [disabled, setDisabled]= useState(true);
    const [clientSecret, setClientSecret]= useState(true);


    useEffect(() => {
        //generate the special stripe which allows us to charge a customer
        const getClientSecret = async () => {
             const response = await axios({
                 method: 'post',
                 //stripe expects the total in a currencies subunits
                 url:  `/payments/create?total=${getBasketTotal(basket)* 100}`
             });

             setClientSecret(response.data.clientSecret)
        }

        getClientSecret();

    }, [basket])

    console.log('The secret is >>>', clientSecret )

    const handleSubmit = async (event) => {
        //do all stripes stuff..
        event.preventDefault();
        setProcessing(true); //butonin e klikon vetem njeher dhe pastaj bllokohet
       
        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method : {
                card: elements.getElement(CardElement)
            }
        }).then(({paymentIntent }) =>{
              //paymentIntent = payment confirmation

              db
              .collection('users')
              .doc(user?.uid)
              .collection('orders')
              .doc(paymentIntent.id)
              .set({
                  basket: basket,
                  amount: paymentIntent.amount,
                  created: paymentIntent.created
              })


              setSucceeded(true);
              setError(null);
              setProcessing(false);

              dispatch({
                  type:'EMPTY_BASKET'

              })


           history.replace('/orders') //pas pageses te mos kthehemi mbrapsht ne te njejten faqe

        })
    }

    const handleChange = event =>{
        //listen for changes in the CardElement and
        // display any errors as the customer types their card details

      setDisabled(event.empty);
      setError(event.error? event.error.message : "");
    }

    return (
        <div className='payment'>
            <div className='payment__container'> 
            <h1>
                Checkout
                (<Link to ='/checkout'> {basket?.length} items </Link>)
            </h1>
            
            <div className='payment__section'>
                    <div className='payment__title'> 
                    <h3> Delivery address </h3> </div>
            </div>
            <div className='payment__address'> 
                 <p> {user?.email}</p>
                 <p> Rruga 'Berardin Palja'</p>
                 <p> Tirane, Albania</p>
                 
            </div>

            <div className='payment__section'>
            <div className='payment__title'>
                <h3> Review items and delivery </h3>
                 </div>
                 <div className='payment__items'>
                     {/* all the products*/}
                     {basket.map(item => (
                         <CheckoutProduct
                         id={item.id}
                         title={item.title}
                         image={item.image}
                         price={item.price}
                         rating={item.rating}
                       />
                     ))}
                 </div>

            </div>

         <div className='payment__section'>
            <div className='payment__items'>

                <h3> Payment method</h3>
            </div>
            <div className='payment__details'>
                {/*stripe magic*/}

                <form onSubmit={handleSubmit}>
                    <CardElement onChange ={handleChange}/>

                    <div className='payment__priceContainer'>
                        <CurrencyFormat
                            renderText={(value) => (
                            <h3> Order total: {value}</h3>
                            )}

                            decimalScale={2}
                            value={getBasketTotal(basket)}
                            displayType={"text"}
                            thousandSeperator={true}
                            prefix={"$"}
                        />
                        <button disabled={processing || disabled || succeeded}>  
                     <span> {processing ?<p> Processing</p> : "Buy now"} </span>
                     </button>
                    </div>
                     
                     {/*errors*/}
                    {error && <div>{error}</div>}
                </form>    
           </div>
      </div>
    </div>
  </div>
    )
}

export default Payment
