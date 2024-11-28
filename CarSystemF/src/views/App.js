import './App.scss';
import { ToastContainer } from 'react-toastify';
import Login from './login/login';
import AdminDashboard from './admin';
//import Register from './login/Resister';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './Example/Home';
import ListUser from './User/ListUser';
import DetailUser from './User/DetailUser';
import ListCar from './Todos/ListCar';
import Document from './Documents/Document';
import CarList from './heater/carlist';
import CarDetail from './Todos/cardetails';
import Logout from './Lognout/lognout';

function App() {
  // Kiểm tra xem người dùng đã đăng nhập hay chưa
  // const isAuthenticated = localStorage.getItem('isAuthenticated');
  // console.log("isAuthenticated:", isAuthenticated);
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <Routes>

            {/* Route mặc định chuyển đến trang login */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/cardetail/:id" element={<CarDetail />} />
            <Route path="/out" element={<Logout />} />

            {/* Bỏ qua kiểm tra xác thực, luôn chuyển đến trang AdminDashboard */}
            <Route path="/admin" element={<AdminDashboard />}>
              {/* Các route con của /admin */}
              <Route path="a" element={<Home />} />
              <Route path="user" element={<ListUser />} />
              <Route path="user/:userId" element={<DetailUser />} />
              <Route path="Todos" element={<ListCar />} />
              <Route path="document" element={<Document />} />
              <Route path="carlist" element={<CarList />} />


            </Route>

            {/* Luôn chuyển đến /admin khi vào /login, bỏ qua kiểm tra xác thực */}
            <Route path="/login" element={<Login />} />



          </Routes>
        </header>

        {/* Toast container để hiển thị thông báo */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
