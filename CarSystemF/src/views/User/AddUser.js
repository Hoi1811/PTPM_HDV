import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "./AddUserModal.scss";

const AddUserModal = ({ onClose, onUserAdded }) => {
    const [formData, setFormData] = useState({
        fullname: "",
        phone_number: "",
        address: "",
        password: "",
        retype_password: "",
        date_of_birth: "",
        facebook_account_id: 0,
        google_account_id: 0,
        role_id: 1, // Default is USER
    });

    // Hàm xử lý thay đổi các input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`Changed ${name} to ${value}`);  // Đảm bảo log giá trị khi thay đổi
        setFormData({
            ...formData,
            [name]: value,  // Cập nhật state đúng cách
        });
    };


    // Hàm xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra mật khẩu và nhập lại mật khẩu có khớp không
        if (formData.password !== formData.retype_password) {
            toast.error("Mật khẩu và nhập lại mật khẩu không khớp!");
            return;
        }

        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.post("http://localhost:8088/api/v1/users/addUser", 
                formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Kiểm tra phản hồi từ API
            if (response.status === 200) {
                toast.success("Thêm người dùng thành công!"); // Hiển thị thông báo thành công
                onUserAdded();  // Gọi hàm onUserAdded để cập nhật danh sách người dùng
                onClose();  // Đóng form modal
            } else {
                toast.error("Thêm người dùng thất bại!");
            }
        } catch (error) {
            toast.error("Không thể thêm người dùng!");
            console.error(error);
        }
    };



    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Thêm Người Dùng</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Tên đầy đủ:
                        <input
                            type="text"
                            name="fullname"  // Tên phải trùng với key trong formData
                            value={formData.fullname}  // Truyền giá trị formData.fullName vào
                            onChange={handleInputChange}  // Gắn sự kiện thay đổi
                            required
                        />
                    </label>

                    <label>
                        Số điện thoại:
                        <input
                            type="text"
                            name="phone_number"  // Tên phải trùng với key trong formData
                            value={formData.phone_number}  // Truyền giá trị formData.phoneNumber vào
                            onChange={handleInputChange}  // Gắn sự kiện thay đổi
                            required
                        />
                    </label>

                    <label>
                        Địa chỉ:
                        <input
                            type="text"
                            name="address"  // Tên phải trùng với key trong formData
                            value={formData.address}  // Truyền giá trị formData.address vào
                            onChange={handleInputChange}
                        />
                    </label>

                    <label>
                        Mật khẩu:
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </label>

                    <label>
                        Nhập lại mật khẩu:
                        <input
                            type="password"
                            name="retype_password"
                            value={formData.retype_password}
                            onChange={handleInputChange}
                            required
                        />
                    </label>

                    <label>
                        Ngày sinh:
                        <input
                            type="date"
                            name="date_of_birth"
                            value={formData.date_of_birth}
                            onChange={handleInputChange}
                        />
                    </label>

                    <label>
                        Role:
                        <select
                            name="role_id"
                            value={formData.role_id}
                            onChange={handleInputChange}
                        >
                            <option value={1}>USER</option>
                            <option value={2}>ADMIN</option>
                        </select>
                    </label>

                    <button type="submit">Thêm</button>
                    <button type="button" onClick={onClose}>
                        Hủy
                    </button>
                </form>

            </div>
        </div>
    );
};

export default AddUserModal;
