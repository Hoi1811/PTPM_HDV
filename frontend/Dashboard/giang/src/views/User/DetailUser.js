import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";

const DetailUser = () => {
    const [user, setUser] = useState(null);  // Khai báo useState để lưu trữ dữ liệu người dùng
    const [isEditing, setIsEditing] = useState(false);  // State để kiểm tra nếu đang chỉnh sửa
    const [editedUser, setEditedUser] = useState(null);  // Lưu trữ dữ liệu người dùng khi chỉnh sửa
    const navigate = useNavigate();
    const location = useLocation();
    const { userId } = useParams();  // Lấy tham số userId từ URL

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`https://reqres.in/api/users/${userId}`);
                console.log("API response:", res);  // Log toàn bộ response để kiểm tra cấu trúc
                if (res.data && res.data.data) {
                    setUser(res.data.data);  // Cập nhật state nếu có dữ liệu
                    setEditedUser(res.data.data); // Cập nhật state khi bắt đầu chỉnh sửa
                } else {
                    console.error("Dữ liệu không hợp lệ");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (userId) {
            fetchUser();  // Fetch dữ liệu người dùng khi có userId
        }
    }, [userId]);  // Chạy lại khi userId thay đổi

    // Hàm quay lại danh sách người dùng
    const handleBack = () => {
        navigate('/user');
    };

    // Hàm bắt đầu chỉnh sửa người dùng
    const handleEdit = () => {
        setIsEditing(true);  // Bật chế độ chỉnh sửa
    };

    // Hàm lưu thông tin chỉnh sửa
    const handleSave = async () => {
        try {
            // Gửi yêu cầu PUT lên server (giả sử PUT vào server)
            const res = await axios.put(`https://reqres.in/api/users/${userId}`, editedUser);
            console.log("Update response:", res);
            setUser(editedUser); // Cập nhật lại user trong state sau khi lưu

            // Chuyển về trang chi tiết và hiển thị thông tin đã chỉnh sửa
            setIsEditing(false); // Tắt chế độ chỉnh sửa
        } catch (error) {
            console.error("Error saving user data:", error);
        }
    };

    // Hàm thay đổi thông tin trong form khi người dùng chỉnh sửa
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div>
            <h1>Chi tiết người dùng với ID: {userId}</h1>
            {user ? (
                <div>
                    {!isEditing ? (
                        // Hiển thị thông tin người dùng
                        <div>
                            <h2>{user.first_name} {user.last_name}</h2>
                            <p>Email: {user.email}</p>
                            <img src={user.avatar} alt={user.first_name} />
                        </div>
                    ) : (
                        // Hiển thị form chỉnh sửa
                        <div>
                            <h3>Chỉnh sửa thông tin</h3>
                            <div>
                                <label>Tên:</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={editedUser.first_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Họ:</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={editedUser.last_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editedUser.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Avatar URL:</label>
                                <input
                                    type="text"
                                    name="avatar"
                                    value={editedUser.avatar}
                                    onChange={handleChange}
                                />
                            </div>
                            <button onClick={handleSave}>Lưu</button>
                        </div>
                    )}
                </div>
            ) : (
                <p>Đang tải dữ liệu...</p>
            )}
            <div style={{ display: 'flex', marginLeft: '650px' }}>
                <div>
                    <button type="button" onClick={handleBack}>Quay lại</button>
                </div>
                {!isEditing && (
                    <div>
                        <button type="button" onClick={handleEdit}>Sửa</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailUser;
