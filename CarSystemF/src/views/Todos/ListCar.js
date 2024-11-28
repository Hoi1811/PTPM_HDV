import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import './ListCar.scss';
import { toast } from 'react-toastify';

const ListCar = () => {
    const [listCar, setListCar] = useState([]);  // State lưu trữ danh sách ô tô
    const [currentPage, setCurrentPage] = useState(1);  // Trạng thái trang hiện tại
    const [totalPages, setTotalPages] = useState(1);  // Tổng số trang
    const [carsPerPage] = useState(10);  // Số ô tô mỗi trang
    const [showAddCarForm, setShowAddCarForm] = useState(false);  // Trạng thái hiển thị form thêm xe
    const [newCar, setNewCar] = useState({ name: "", model: "", year: "", price: "" });  // Thông tin xe mới
    const navigate = useNavigate();  // Hook điều hướng
    const [selectedCar, setSelectedCar] = useState(null);

    // Hàm fetch dữ liệu ô tô từ API với phân trang
    const fetchCars = async (page) => {
        try {
            const res = await axios.get(`http://localhost:8088/api/v1/car?page=${page}&limit=${carsPerPage}`);
            console.log(res.data);
            const cars = res.data.cars;
            const total = res.data.totalPage;

            setListCar(cars);
            setTotalPages(total);
        } catch (error) {
            console.error("Error fetching cars:", error);
        }
    };

    useEffect(() => {
        fetchCars(currentPage);
    }, [currentPage]);



    const handleDeleteCar = async (carId) => {
        try {
            const token = localStorage.getItem('authToken'); // Lấy token từ localStorage
            if (!token) {
                toast.error("Bạn chưa đăng nhập hoặc token đã hết hạn.");
                return;
            }

            // Gửi yêu cầu xóa xe từ API
            const response = await axios.delete(`http://localhost:8088/api/v1/car/delete?id=${carId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,  // Gửi token trong header
                }
            });

            // Nếu xóa thành công, cập nhật lại danh sách xe
            if (response.status === 200) {
                toast.success("Xóa ô tô thành công!");
                setListCar(prevList => prevList.filter(car => car.id !== carId));  // Loại bỏ xe đã xóa khỏi danh sách
            } else {
                toast.error("Không thể xóa ô tô!");
            }
        } catch (error) {
            toast.error("Không thể xóa ô tô!");
            console.error("Error deleting car:", error);
        }
    };



    // Hàm chuyển trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchCars(page);
    };

    // Hàm chuyển trang tiếp theo
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Hàm chuyển trang trước
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Hàm tạo các trang cho phân trang
    const createPageNumbers = () => {
        const pageNumbers = [];
        if (totalPages <= 3) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage === 1) {
                pageNumbers.push(1, 2, 3, '...');
            } else if (currentPage === totalPages) {
                pageNumbers.push('...', totalPages - 2, totalPages - 1, totalPages);
            } else {
                pageNumbers.push('...', currentPage - 1, currentPage, currentPage + 1, '...');
            }
        }
        return pageNumbers;
    };

    // Hàm thêm xe mới
    const handleAddCar = async () => {
        try {
            // Gửi yêu cầu thêm xe mới đến API
            const response = await axios.post(`http://localhost:8088/api/v1/car`, newCar, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,  // Gửi token xác thực nếu cần
                },
            });

            // Nếu thành công, hiển thị thông báo và cập nhật lại danh sách xe
            toast.success("Thêm xe mới thành công!");
            fetchCars(currentPage);
            setShowAddCarForm(false);  // Đóng form thêm xe
            setNewCar({ name: "", model: "", year: "", price: "" });  // Reset form
        } catch (error) {
            toast.error("Không thể thêm xe mới!");
            console.error("Error adding car:", error);
        }
    };

    // Hàm mở form thêm xe mới
    const openAddCarForm = () => {
        setShowAddCarForm(true);  // Mở form thêm xe
    };

    // Hàm đóng form thêm xe mới
    const handleCloseForm = () => {
        setShowAddCarForm(false);  // Đóng form thêm xe
    };

    // Hàm thay đổi giá trị trong form nhập liệu
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCar(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleEditCar = () => {

    }
    const handleViewDetails = () => {

    }
    return (
        <div className="list-car-container">
            <div style={{ display: 'flex', marginLeft: '80px' }}>
                <div className="title" style={{ marginLeft: '-70px' }}>Danh sách ô tô</div>
                {/* bỏ trạng thái */}
                <div style={{ marginLeft: '350px' }}></div>
                <div style={{ marginLeft: '200px' }}>
                    <button type="button" onClick={openAddCarForm}>Thêm mới xe</button>
                </div>
            </div>

            <div className="list-car-content">
                {listCar && listCar.length > 0 &&
                    listCar.map((item, index) => {
                        const carIndex = (currentPage - 1) * carsPerPage + index + 1;
                        return (
                            <div className="child" key={item.model_name}>
                                <div className="car-info">
                                    <span>{carIndex}.{item.name} - {item.model}</span>

                                </div>
                                <div className="list-ud">
                                    <div>

                                        <button class="btn btn-1" type="button" onClick={() => handleDeleteCar(item.id)}>
                                            Xóa
                                        </button>
                                    </div>
                                    <div>
                                        <button class="btn btn-2" type="button" onClick={() => handleEditCar(item.id)}>
                                            Sửa
                                        </button>
                                    </div>
                                    <div> {/* Link đến trang chi tiết xe */}
                                        <Link to={`/cardetail/${item.id}`}>
                                            <button class="btn btn-3">Chi Tiết</button>
                                        </Link></div>
                                </div>


                            </div>
                        );
                    })
                }
            </div>

            {showAddCarForm && (
                <div className="add-car-form">
                    <h3>Thêm xe mới</h3>
                    <div>
                        <label>Tên xe:</label>
                        <input
                            type="text"
                            name="name"
                            value={newCar.name}
                            onChange={handleInputChange}
                            placeholder="Nhập tên xe"
                        />
                    </div>
                    <div>
                        <label>Model:</label>
                        <input
                            type="text"
                            name="model"
                            value={newCar.model}
                            onChange={handleInputChange}
                            placeholder="Nhập model xe"
                        />
                    </div>
                    <div>
                        <label>Year:</label>
                        <input
                            type="text"
                            name="year"
                            value={newCar.year}
                            onChange={handleInputChange}
                            placeholder="Nhập năm sản xuất"
                        />
                    </div>
                    <div>
                        <label>Price:</label>
                        <input
                            type="number"
                            name="price"
                            value={newCar.price}
                            onChange={handleInputChange}
                            placeholder="Nhập giá xe"
                        />
                    </div>
                    <div>
                        <button type="button" onClick={handleAddCar}>Thêm xe</button>
                        <button type="button" onClick={handleCloseForm}>Hủy</button>
                    </div>
                </div>
            )}

            {/* Phân trang */}
            <div className="pagination">
                {totalPages > 1 && (
                    <div className="pagination-buttons">
                        <button
                            className="page-button"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
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
        </div>
    );
};

export default ListCar;
