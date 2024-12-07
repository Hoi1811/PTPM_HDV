import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';  // Để hiển thị thông báo
import 'react-toastify/dist/ReactToastify.css';
import './login.scss';

const Login = () => {
    const [phone_number, setPhoneNumber] = useState('');  // State lưu số điện thoại người dùng
    const [password, setPassword] = useState('');  // State lưu mật khẩu người dùng
    const [loading, setLoading] = useState(false);  // State kiểm tra trạng thái đang gửi yêu cầu
    const navigate = useNavigate();  // Hook để điều hướng người dùng

    // Hàm xử lý khi người dùng submit form
    const handleLogin = async (e) => {
        e.preventDefault();  // Ngừng việc reload trang khi submit

        // Kiểm tra dữ liệu nhập vào
        if (!phone_number || !password) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }

        setLoading(true);  // Đang xử lý yêu cầu đăng nhập

        try {
            // Gửi yêu cầu đăng nhập 
            const response = await axios.post('http://localhost:8088/api/v1/users/login', {
                phone_number,
                password,
            });

            // Kiểm tra nếu đăng nhập thành công
            console.log('Response:', response);

            if (response.data.message === "Login Success" && response.data.token) {
                // Lưu thông tin token vào localStorage
                localStorage.setItem('authToken', response.data.token);
                console.log('Token đã lưu:', localStorage.getItem('authToken'));
                // Optionally, lưu thông tin người dùng nếu có trong response
                localStorage.setItem('user', JSON.stringify(response.data.user));
                //  localStorage.setItem('authToken', response.data.token);
                // localStorage.setItem('isAuthenticated', true);
                navigate('/admin')
                toast.success("Đăng nhập thành công!");

                // Điều hướng người dùng tới trang quản trị hoặc trang chủ
                // navigate('/admin');  // Chuyển hướng tới trang dashboard (quản trị)
            } else {
                toast.error("Thông tin đăng nhập không chính xác!");
            }
        } catch (error) {
            console.error("Đăng nhập thất bại:", error);
            toast.error("Đã có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            setLoading(false);  // Kết thúc việc xử lý đăng nhập
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Đăng Nhập</h2>

            <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                    <label>Số điện thoại</label>
                    <input
                        type="text"  // Sử dụng type="text" cho phone_number
                        value={phone_number}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Nhập số điện thoại"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Mật khẩu</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
                        required
                    />
                </div>

                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
            </form>

            <div className="login-footer">
                <p className="forgot-password">
                    <a href="/forgot-password">Quên mật khẩu?</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
