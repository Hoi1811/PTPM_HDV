import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "./EditUserModal.scss";

const EditUserModal = ({ onClose, onUserUpdated, currentUser }) => {
    const [formData, setFormData] = useState({
        fullname: "",
        phone_number: "",
        address: "",
        password: "",
        retype_password: "",
        date_of_birth: "",
        role_id: 1, // Default to "USER"
    });

    useEffect(() => {
        if (currentUser) {
            setFormData({
                fullname: currentUser.fullname || "",
                phone_number: currentUser.phone_number || "",
                address: currentUser.address || "",
                password: "", // Don't pre-fill the password fields
                retype_password: "",
                date_of_birth: currentUser.date_of_birth || "",
                role_id: currentUser.role_id || 1, // Default to "USER" if no role
            });
        }
    }, [currentUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.retype_password) {
            toast.error("Mật khẩu và nhập lại mật khẩu không khớp!");
            return;
        }

        // Prepare the params object to be sent in the request
        const params = {
            fullname: formData.fullname,
            phone_number: formData.phone_number,
            address: formData.address,
            password: formData.password || "",  // Only include password if it's set
            retype_password: formData.retype_password || "",  // Only include retype_password if it's set
            date_of_birth: formData.date_of_birth,
            role_id: formData.role_id,
        };

        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.put("http://localhost:8088/api/v1/users/updateUser", 
                params, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }  // Send the data as URL params
            });

            if (response.status === 200) {
                toast.success("Cập nhật người dùng thành công!");
                onUserUpdated(); // Refresh user list after update
                onClose(); // Close the modal
            } else {
                toast.error("Cập nhật người dùng thất bại!");
            }
        } catch (error) {
            toast.error("Không thể cập nhật người dùng!");
            console.error(error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Cập Nhật Người Dùng</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Tên đầy đủ:
                        <input
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleInputChange}
                            placeholder="Tên đầy đủ"
                            required
                        />
                    </label>

                    <label>
                        Số điện thoại:
                        <input
                            type="text"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleInputChange}
                            placeholder="Số điện thoại"
                            required
                        />
                    </label>

                    <label>
                        Địa chỉ:
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Địa chỉ"
                        />
                    </label>

                    <label>
                        Mật khẩu:
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Mật khẩu"
                        />
                    </label>

                    <label>
                        Nhập lại mật khẩu:
                        <input
                            type="password"
                            name="retype_password"
                            value={formData.retype_password}
                            onChange={handleInputChange}
                            placeholder="Nhập lại mật khẩu"
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
                        Vai trò:
                        <select
                            name="role_id"
                            value={formData.role_id}
                            onChange={handleInputChange}
                        >
                            <option value={1}>USER</option>
                            <option value={2}>ADMIN</option>
                        </select>
                    </label>

                    <button type="submit">Lưu</button>
                    <button type="button" onClick={onClose}>
                        Hủy
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
