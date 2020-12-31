import React, { useEffect } from "react";
import "./App.css";
import Header from "./Header";
import Home from "./Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Checkout from "./Checkout";
import Login from "./Login";
import { auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import Payment from "./Payment";
import Orders from "./Orders";
import {loadStripe} from "@stripe/stripe-js";
import {Elements, useElements} from "@stripe/react-stripe-js";

const promise=loadStripe('pk_test_51Hqht2H5CpGccQC0FJdPGYAWKDLwawGFwznL9nWG9gCrcv1OJk4mKJj2ZrYW2AXvw4f007IaeRbIQbhQErQBqvDB00XQPCNEWg');


function App() {
  const [{}, dispatch] = useStateValue();

  useEffect(() => {
    // will only run once when the app component loads...

    auth.onAuthStateChanged((authUser) => {
      console.log("THE USER IS >>> ", authUser);

      if (authUser) {
        // the user just logged in / the user was logged in

        dispatch({
          type: "SET_USER",
          user: authUser
        });
      } else {
        // the user is logged out
        dispatch({
          type: "SET_USER",
          user: null
        });
      }
    })
  }, []);

  return (
    //BEM
    <Router>
      <div className="app">
        <Switch>

        <Route path="/orders">
            <Orders />
          </Route>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/checkout">
            <Header />
            <Checkout />
          </Route>

          <Route path="/payment">
            <Header />
            <Elements stripe={promise}>
               <Payment/>
            </Elements>
           
         <h1>im a payment page </h1>
          </Route>
         
          <Route path="/">
            <Header />
            <Home />
          </Route>

        </Switch>
      </div>
    </Router>
  );
}

export default App;
