import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import './ListCar.scss';
import { toast } from 'react-toastify';
import AddCarForm from "./AddCarForm";
import UpdateCarForm from "./updatecar";

const ListCar = () => {
    const [listCar, setListCar] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [carsPerPage] = useState(6);
    const [showAddCarForm, setShowAddCarForm] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const apiURL = process.env.REACT_APP_API_BASE_URL;

    const navigate = useNavigate();

    // Fetch dữ liệu ô tô từ API
    const fetchCars = async (page) => {
        try {
            const res = await axios.get(`${apiURL}car?page=${page}&limit=${carsPerPage}`);
            const cars = res.data.content;
            const total = res.data.totalPages;

            setListCar(cars);
            setTotalPages(total);
        } catch (error) {
            console.error("Error fetching cars:", error);
        }
    };

    useEffect(() => {
        fetchCars(currentPage);
    }, [apiURL, carsPerPage, currentPage]);

    const handleDeleteCar = async (carId) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                toast.error("Bạn chưa đăng nhập hoặc token đã hết hạn.");
                return;
            }

            const response = await axios.delete(`${apiURL}car/delete?id=${carId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                toast.success("Xóa ô tô thành công!");
                setListCar(prevList => prevList.filter(car => car.id !== carId));
            } else {
                toast.error("Không thể xóa ô tô!");
            }
        } catch (error) {
            toast.error("Không thể xóa ô tô!");
            console.error("Error deleting car:", error);
        }
    };
    
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchCars(page);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const createPageNumbers = () => {
        const pageNumbers = [];
        if (totalPages <= 3) {
            for (let i = 0; i < totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage === 0) {
                pageNumbers.push(0, 1, 2, '...');
            } else if (currentPage === totalPages - 1) {
                pageNumbers.push('...', totalPages - 3, totalPages - 2, totalPages - 1);
            } else {
                pageNumbers.push('...', currentPage - 1, currentPage, currentPage + 1, '...');
            }
        }
        return pageNumbers;
    };

    const openAddCarForm = () => {
        setShowAddCarForm(true);
    };

    const handleCloseForm = () => {
        setShowAddCarForm(false);
    };

    const handleAddCarSuccess = (newCar) => {
        setListCar((prevCars) => [...prevCars, newCar]);
        toast.success('Xe đã được thêm thành công!');
        setShowAddCarForm(false);
    };

    const openUpdateModal = (car) => {
        setSelectedCar(car);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCar(null);
    };

    const handleUpdateSuccess = () => {
        fetchCars(currentPage);
        closeModal();
    };

    return (
        <div className="list-car-container">
            <div style={{ display: 'flex', marginLeft: '80px' }}>
                <div className="title" style={{ marginLeft: '-70px' }}>Danh sách ô tô</div>
                <div style={{ marginLeft: '500px' }}>
                    <button type="button" onClick={openAddCarForm}>Thêm mới xe</button>
                </div>
            </div>
            <div className="list-car-content">
                {listCar && listCar.length > 0 &&
                    listCar.map((item) => (
                        <div className="child" key={item.id}>
                            <div className="car-info">
                                <span>{item.id}. {item.name} - {item.model}</span>
                            </div>
                            <div className="list-ud">
                                <button className="btn btn-1" onClick={() => handleDeleteCar(item.id)}>Xóa</button>
                                <button onClick={() => openUpdateModal(item)}>Sửa</button>
                                <Link to={`/admin/cardetail/${item.id}`}>
                                    <button className="btn btn-3">Chi Tiết</button>
                                </Link>
                            </div>
                        </div>
                    ))
                }
            </div>

            {showAddCarForm && (
                <AddCarForm onClose={handleCloseForm} onAddCarSuccess={handleAddCarSuccess} />
            )}

            {isModalOpen && selectedCar && (
                <UpdateCarForm
                    selectedCar={selectedCar}
                    onClose={closeModal}
                    onUpdateSuccess={handleUpdateSuccess}
                />
            )}

            <div className="pagination">
                {totalPages > 1 && (
                    <div className="pagination-buttons">
                        <button
                            className="page-button"
                            onClick={handlePrevPage}
                            disabled={currentPage === 0}
                        >
                            {"<<"}
                        </button>
                        {createPageNumbers().map((page, index) => (
                            <button
                                key={index}
                                className={`page-button ${page === currentPage ? 'active' : ''}`}
                                onClick={() => page !== '...' && handlePageChange(page)}
                                disabled={page === '...'}
                            >
                                {typeof page === 'number' ? page + 1 : page}
                            </button>
                        ))}
                        <button
                            className="page-button"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages - 1}
                        >
                            {">>"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListCar;
