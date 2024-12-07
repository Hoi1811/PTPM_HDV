import React from 'react';
import { Routes, Route, useLocation, BrowserRouter } from 'react-router-dom';
import Home from './Example/Home';
import ListUser from './User/ListUser';
import DetailUser from './User/DetailUser';
import ListCar from './Todos/ListCar';
import Document from './Documents/Document';
import Nav from './nav/Nav';
import Header from './heater/heater';
import './admin-dashboard.scss';
import CarList from './heater/carlist';
//import CarDetail from './Todos/cardetails';



const AdminDashboard = () => {
    // const location = useLocation();
    // console.log('Current Location:', location.pathname);
    return (
        <div className="admin-dashboard">
            <Header />
            <Nav/>
            <div className="routes-container">
                <Routes>
                    <Route path="/a" element={<Home />} />
                    <Route path="/user" element={<ListUser />} />
                    <Route path="/user/:userId" element={<DetailUser />} />
                    <Route path="/Todos" element={<ListCar />} />
                    <Route path="/document" element={<Document />} />
                    <Route path="/carlist" element={<CarList />} />
                    {/* <Route path="/cardetail/:id" element={<CarDetail />} /> */}
                    <Route path="*" element={<ListUser />} />

                </Routes>
            </div>
        </div>
    );

};

export default AdminDashboard;
