import React, { useState } from 'react';
import './Register.scss';  // Đảm bảo bạn đã tạo file Register.scss
import { toast } from 'react-toastify';  // Để hiển thị thông báo
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    // Quản lý trạng thái form
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();  // Sử dụng useNavigate để chuyển hướng

    // Tài khoản mặc định (mock account)
    const defaultAccount = {
        username: 'user_default',
        password: 'default1234',
        email: 'default@example.com'
    };

    // Hàm xử lý đăng ký
    const handleRegister = async (e) => {
        e.preventDefault(); // Ngăn ngừa reload trang khi submit form

        // Kiểm tra các thông tin đầu vào
        if (!username || !password || !email || !confirmPassword) {
            setErrorMessage('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp không
        if (password !== confirmPassword) {
            setErrorMessage('Mật khẩu xác nhận không khớp!');
            return;
        }

        // Cấu trúc dữ liệu để gửi lên API
        const registerData = {
            username: username,
            password: password,
            email: email,
        };

        try {
            // Gọi API để đăng ký người dùng
            const response = await axios.post('https://api.example.com/register', registerData);

            // Kiểm tra xem đăng ký thành công hay không
            if (response.data.success) {
                // Đăng ký thành công, hiển thị thông báo và chuyển hướng sang trang đăng nhập
                toast.success('Đăng ký thành công!');
                navigate('/login');
            } else {
                setErrorMessage(response.data.message || 'Đăng ký thất bại. Vui lòng thử lại.');
            }
        } catch (error) {
            // Nếu API có lỗi, sử dụng tài khoản mặc định
            console.error('Đã có lỗi xảy ra: ', error);
            setErrorMessage('Đã có lỗi xảy ra. Sử dụng tài khoản mặc định.');

            // Hiển thị thông báo thành công khi dùng tài khoản mặc định
            toast.success('Sử dụng tài khoản mặc định: Đăng nhập với username: "user_default" và password: "default1234"');

            // Điều hướng sang trang đăng nhập với tài khoản mặc định
            navigate('/login', {
                state: {
                    username: defaultAccount.username,
                    password: defaultAccount.password
                }
            });
        }
    };

    return (
        <div className="register-wrapper">
            <div className="register-container">
                <h2>Đăng ký tài khoản</h2>

                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                <form className="register-form" onSubmit={handleRegister}>
                    <div className="form-group">
                        <label htmlFor="username">Tên người dùng</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Nhập tên người dùng"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Nhập email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            id="confirm-password"
                            placeholder="Xác nhận mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit">Đăng ký</button>
                </form>

                <div className="login-link">
                    <span>Đã có tài khoản? <a href="/login">Đăng nhập</a></span>
                </div>
            </div>
        </div>
    );
};

export default Register;
