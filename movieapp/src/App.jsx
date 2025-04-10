import React from 'react';
import { Routes, Route } from "react-router-dom";

import SignUp from './Components/LoginAndSignUp/SignUp';
import Login from './Components/LoginAndSignUp/Login';
import AdminDashboard from './Components/AdminDashBoad/AdminDashboard';
import Navbar from './Components/Navbar';
import Home from './Components/Home/Home';
import AddMovie from './Pages/AddMovie';
import AddTheater from './Pages/AddTheater';
import MyTickets from './Pages/MyTickets';
import MovieDashboard from './Components/AdminDashBoad/MovieDashboard';
import AddShow from './Pages/AddShow';
import Shows from './Pages/Shows';
import BookNow from './Pages/BookNow';
import Checkout from './Pages/Checkout';
import PaymentSuccess from './Pages/PaymentSuccess';

function App() {
  return (
    <>
      <Navbar /> {/* Always shown */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/MovieDashboard" element={<MovieDashboard/>}/>
  
        {<Route path="/add-movie" element={<AddMovie/>} /> }
        {<Route path="/add-theater" element={<AddTheater/>} />}
        { <Route path="/my-tickets" element={<MyTickets/>} />}
        {<Route path="/add-show" element={<AddShow/>} />}
        {<Route path="/shows" element={<Shows/>} />}
        {<Route path="/book-now" element={<BookNow/>} />}
        <Route path="/checkout" element={<Checkout />} /> {/* 👈 THIS IS MISSING */}
        <Route path="/checkout/:ticketId" element={<Checkout/>} />
        <Route path="/success" element={<PaymentSuccess/>} />
        <Route path="/cancel" element={<div>❌ Payment Cancelled.</div>} />

        {/* Add other routes as needed */}
      </Routes>
    </>
  );
}

export default App;
