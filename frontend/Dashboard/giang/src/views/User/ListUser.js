
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ListUser.scss";
import { toast } from "react-toastify";
import AddUserForm from "./adduser";
import UpdateUserForm from "./updateuser";

const ListUser = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null); // Store the current user for editing
    const [listUsers, setListUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [usersPerPage] = useState(6);
    const navigate = useNavigate();

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const handleOpenEditModal = (user) => {
        setCurrentUser(user); // Set current user for editing
        setEditModalOpen(true); // Open edit modal
    };

    const handleCloseEditModal = () => setEditModalOpen(false);

    const handleUserAdded = () => {
        fetchUsers(); // Refresh user list after adding a user
    };

    const handleUserUpdated = () => {
        fetchUsers(); // Refresh user list after updating a user
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const res = await axios.get("http://localhost:8088/api/v1/users/getAllUsers", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setListUsers(res.data);
            setTotalPages(Math.ceil(res.data.length / usersPerPage));
        } catch (error) {
            toast.error("Không thể lấy danh sách người dùng!");
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const handleDeleteUser = async (phoneNumber) => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.delete("http://localhost:8088/api/v1/users/delete", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                params: { phoneNumber },
            });

            toast.success("Xóa người dùng thành công!");
            fetchUsers(); // Refresh user list
        } catch (error) {
            toast.error("Không thể xóa người dùng!");
            console.error("Error deleting user:", error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const createPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    return (
        <div className="list-user-container">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <div className="title">Danh sách người dùng</div>
                <button onClick={handleOpenModal}>Thêm Người Dùng</button>
                {isModalOpen && (
                    <AddUserForm onClose={handleCloseModal} onUserAdded={handleUserAdded} />
                )}
            </div>

            <div className="list-user-content">
                {listUsers.length > 0 ? (
                    listUsers
                        .slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)
                        .map((user, index) => {
                            const userIndex = (currentPage - 1) * usersPerPage + index + 1;
                            return (
                                <div className="child" key={user.phone_number}>
                                    <div className="user-info">
                                        <span>
                                            {userIndex}. {user.fullname} - {user.phone_number}
                                        </span>
                                        <span
                                            className={`status ${user.is_active ? "online" : "offline"}`}
                                        >
                                            {user.is_active ? "Online" : "Offline"}
                                        </span>
                                        <span>
                                            Vai trò: {user.role?.name || "Không xác định"}
                                        </span>
                                    </div>
                                    <div className="list-ud">
                                        <button onClick={() => handleOpenEditModal(user)}>
                                            Sửa
                                        </button>
                                        <button onClick={() => handleDeleteUser(user.phone_number)}>
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                ) : (
                    <div>Không có người dùng nào!</div>
                )}
            </div>

            {isEditModalOpen && (
                <UpdateUserForm
                    userId={currentUser?.userId}  // Truyền lại thông tin userId nếu cần thiết
                    selectedUser={currentUser}  // Chắc chắn `currentUser` được truyền đúng
                    onClose={handleCloseEditModal}
                    onUpdateSuccess={handleUserUpdated}
                />
            )}

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="page-button"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                    >
                        {"<<"}
                    </button>
                    {createPageNumbers().map((page) => (
                        <button
                            key={page}
                            className={`page-button ${currentPage === page ? "active" : ""}`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        className="page-button"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        {">>"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ListUser;
