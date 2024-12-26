import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'; // Đảm bảo đường dẫn đúng

import Admin from './admin/admin';
import { CarDetail } from './components/DesignCar/ChiTiet';
import Login from './views/login/login';
import AdminDashboard from './views/admin';
import Home from './views/Example/Home';
import ListUser from './views/User/ListUser';
import DetailUser from './views/User/DetailUser';
import ListCar from './views/Todos/ListCar';
import Document from './views/Documents/Document';
import CarList from './views/heater/carlist';
import CarDetailAdmin from './views/Todos/cardetails';
import Logout from './views/Lognout/lognout';
import NotAuthorized from './components/NotAuthorized/NotAuthorized';
import TopCarChart from './components/topCar/topCarChart';
import Services from './components/Services/Services';
import SearchCar from './components/SearchCar/SearchCar';
function App() {
  // State để lưu trạng thái đăng nhập và thông tin người dùng
  const [user, setUser] = useState({
    isLoggedIn: localStorage.getItem('authToken') ? true : false, // Kiểm tra authToken trong localStorage
    role: 'ADMIN', // Hoặc 'USER' để kiểm tra quyền hạn
  });

  useEffect(() => {
    // Lắng nghe sự thay đổi của token để cập nhật trạng thái đăng nhập
    setUser({
      isLoggedIn: localStorage.getItem('authToken') ? true : false,
      role: localStorage.getItem('authToken') ? 'ADMIN' : 'USER', // Thay đổi role nếu cần
    });
  }, [localStorage.getItem('authToken')]); // Theo dõi sự thay đổi của authToken

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/searchCar" element={<SearchCar/>}/>
        <Route path="/home" element={<Admin />} />
        <Route path="/services" element={<Services />} />
          <Route path="/" element={<Admin />} />
          <Route path="/car/:id" element={<CarDetail />} />
          <Route path="/topCar" element={<TopCarChart />} />
          {/* Bảo vệ đường dẫn admin */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute
                element={<AdminDashboard />}
                user={user}
                requiredRole="ADMIN"
              />
            }
          >
            {/* Các route con của /admin */}
            <Route path="a" element={<Home />} />
            <Route path="user" element={<ListUser />} />
            <Route path="user/:userId" element={<DetailUser />} />
            <Route path="Todos" element={<ListCar />} />
            <Route path="document" element={<Document />} />
            <Route path="carlist" element={<CarList />} />
            <Route path="cardetail/:id" element={<CarDetailAdmin />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/not-authorized" element={<NotAuthorized />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
