import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './update.scss';

const UpdateUserForm = ({ selectedUser, onClose, onUpdateSuccess }) => {
    const [userData, setUserData] = useState({
        fullname: '',
        phone_number: '',
        address: '',
        password: '',
        date_of_birth: '',
        role_id: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedUser) {
            console.log('Selected user data:', selectedUser);
            setUserData({
                fullname: selectedUser.fullname || '',
                phone_number: selectedUser.phone_number || '',
                address: selectedUser.address || '',
                password: '', // Mật khẩu sẽ để trống
                date_of_birth: selectedUser.date_of_birth || '',
                role_id: selectedUser.role_id || '',
            });
        }
    }, [selectedUser]);
    if (!selectedUser) {
        return <div>Loading...</div>;
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const validateForm = () => {
        const { fullname, phone_number, password, role_id } = userData;
        if (!fullname || !phone_number || !password || !role_id) {
            setError('Vui lòng điền đầy đủ các trường bắt buộc!');
            return false;
        }
        return true;
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        const updateUserData = {
            fullname: userData.fullname,
            phone_number: userData.phone_number,
            address: userData.address,
            password: userData.password,
            date_of_birth: userData.date_of_birth,
            role_id: userData.role_id,
        };

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Vui lòng đăng nhập lại!');
                setLoading(false);
                return;
            }

            const response = await axios.put(
                `http://localhost:8088/api/v1/users/updateUser`,
                updateUserData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('User updated successfully:', response.data);
            onUpdateSuccess(); // Call callback when update is successful
            onClose(); // Close the modal
            alert('Cập nhật tài khoản thành công!');
            setError(null);
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'Không thể cập nhật người dùng');
                alert(error.response.data.message || 'Không thể cập nhật người dùng');
            } else {
                setError('Không thể kết nối tới server');
                alert('Lỗi kết nối tới server. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Cập Nhật Tài Khoản Người Dùng</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleUpdateUser}>
                    <div className="form-group">
                        <label>Họ và tên</label>
                        <input
                            type="text"
                            name="fullname"
                            value={userData.fullname}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input
                            type="text"
                            name="phone_number"
                            value={userData.phone_number}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Địa chỉ</label>
                        <input
                            type="text"
                            name="address"
                            value={userData.address}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Ngày sinh</label>
                        <input
                            type="date"
                            name="date_of_birth"
                            value={userData.date_of_birth}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Vai trò</label>
                        <input
                            type="number"
                            name="role_id"
                            value={userData.role_id}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateUserForm;
