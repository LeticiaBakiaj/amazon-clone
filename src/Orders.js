import React from 'react';
import './Orders.css';
import { useState, useEffect } from 'react';
import { db } from './firebase';
import Order from './Order'
import { useStateValue } from './StateProvider';

function Orders({ }) {

    const [{basket, user}, dispatch] = useStateValue();
    const [orders, setOrders] = useState([]);

    useEffect(() => {

        if(user){
            db
            .collection('users')
            .doc(user?.uid)
            .collection('orders')
            .orderBy('created', 'desc')
            .onSnapshot(snapshot => {
                //nqs hedhim ose heqim nje vlere nga db do na ktheje nje pergjigje
            setOrders(snapshot.docs.map(doc =>({
                id:doc.id,
                data:doc.data()
            }) ))
            })
      } else {

          setOrders([ ])
      }
    }, [user])
        return (
        <div className='orders'>
            <h2>Your Orders</h2>

            <div className="orders__order">  
                {orders?.map(order => (
                   <Order order={order}/>
    
            ))}


        </div>

     </div>
  )     
}

export default Orders