import React from 'react';
import { useNavigate } from 'react-router-dom'; // Hook điều hướng của React Router
import { toast } from 'react-toastify'; // Để hiển thị thông báo toast
import Header from '../heater/heater';

const Logout = () => {
    const navigate = useNavigate(); // Để điều hướng người dùng

    const handleLogout = () => {
        // Xóa thông tin xác thực người dùng khỏi localStorage hoặc sessionStorage
        localStorage.removeItem('authToken'); // Xóa token xác thực, bạn có thể thay đổi tên key tùy thuộc vào cấu trúc của bạn
        sessionStorage.removeItem('authToken'); // Nếu bạn dùng sessionStorage thay vì localStorage\

        // Nếu bạn lưu trữ thông tin người dùng khác, cũng cần xóa
        localStorage.removeItem('user');  // Ví dụ: Xóa thông tin người dùng
        sessionStorage.removeItem('user');

        // Hiển thị thông báo đăng xuất thành công
        toast.success("Đăng xuất thành công!");

        // Điều hướng về trang đăng nhập hoặc trang chủ
        navigate('/login');  // Điều hướng đến trang đăng nhập
    };

    return (
        <>
            <Header />
            <div className="logout-container">
                <button style={{ border: '1px solid grey' }} type='button ' onClick={handleLogout}>Đăng xuất</button>
            </div>
        </>
    );
};

export default Logout;
