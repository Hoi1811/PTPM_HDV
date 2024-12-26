import React, { useState } from 'react';
import axios from 'axios';
import './adduser.scss';

const AddUserForm = ({ onClose, onUserAdded }) => {
    const [userData, setUserData] = useState({
        fullname: '',
        phone_number: '',
        address: '',
        password: '',
        retype_password: '',
        date_of_birth: '',
        facebook_account_id: '',
        google_account_id: '',
        role_id: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const validateForm = () => {
        const { fullname, phone_number, password, retype_password, role_id } = userData;
        if (!fullname || !phone_number || !password || !retype_password || !role_id) {
            setError('Vui lòng điền đầy đủ các trường bắt buộc!');
            return false;
        }
        return true;
    };

    const handleAddUser = async (e) => {
        debugger;
        e.preventDefault();
        setError(null); // Reset error state

        // Kiểm tra mật khẩu và xác nhận mật khẩu
        if (userData.password !== userData.retype_password) {
            setError('Mật khẩu và xác nhận mật khẩu không khớp.');
            alert('Mật khẩu và xác nhận mật khẩu không khớp.'); // Thông báo lỗi cho người dùng
            return;
        }

        // Kiểm tra dữ liệu trước khi gửi
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {

            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Vui lòng đăng nhập lại!');
                setLoading(false);
                return;
            }

            // Gửi yêu cầu POST
            const response = await axios.post('http://localhost:8088/api/v1/users/addUser', userData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            console.log('User added successfully:', response.data);
            onUserAdded(); // Call callback when successful
            onClose(); // Close the modal
            alert('Tạo tài khoản thành công!'); // Thông báo thành công
            setError(null); // Clear error state

        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'Không thể thêm người dùng');
                alert(error.response.data.message || 'Không thể thêm người dùng'); // Thông báo lỗi cho người dùng
            } else {
                setError('Không thể kết nối tới server');
                alert('Lỗi kết nối tới server. Vui lòng thử lại sau.'); // Thông báo lỗi nếu không kết nối được
            }
        } finally {
            setLoading(false); // Tắt loading sau khi hoàn thành
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Thêm Tài Khoản Người Dùng</h2>

                {/* Hiển thị thông báo lỗi nếu có */}
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleAddUser}>
                    <div>
                        <label>Họ và tên</label>
                        <input type="text" name="fullname" value={userData.fullname} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Số điện thoại</label>
                        <input type="text" name="phone_number" value={userData.phone_number} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Địa chỉ</label>
                        <input type="text" name="address" value={userData.address} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Mật khẩu</label>
                        <input type="password" name="password" value={userData.password} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Xác nhận mật khẩu</label>
                        <input type="password" name="retype_password" value={userData.retype_password} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Ngày sinh</label>
                        <input type="date" name="date_of_birth" value={userData.date_of_birth} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Role ID</label>
                        <input type="number" name="role_id" value={userData.role_id} onChange={handleChange} required />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Đang thêm...' : 'Lưu'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddUserForm;
