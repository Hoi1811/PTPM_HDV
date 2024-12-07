import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './a.scss'
import Header from './heater';

const CarList = () => {
    const location = useLocation();  // Lấy location từ React Router
    const { cars, searchQuery, page, limit } = location.state || {};  // Lấy dữ liệu từ state

    const [currentCars, setCurrentCars] = useState(cars || []); // State lưu danh sách ô tô
    const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
    const [error, setError] = useState(null); // Trạng thái lỗi

    // Phân trang
    const [currentPage, setCurrentPage] = useState(page || 0);
    const [currentLimit, setCurrentLimit] = useState(limit || 5);

    // Thêm chức năng phân trang nếu cần
    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    useEffect(() => {
        if (Array.isArray(cars)) {
            setCurrentCars(cars); // Cập nhật dữ liệu ô tô
        } else {
            setError("Không có xe ô tô nào được tìm thấy");
        }
    }, [cars]);  // Thêm dependency cho useEffect

    return (
        <div>
            <div>
                <div className="header">
                    <Header />
                    <h2>Kết quả tìm kiếm: "{searchQuery}"</h2>
                    <div></div>
                </div>

                <div className="car-list">
                    {loading && <p>Đang tải...</p>}
                    {error && <p className="error">{error}</p>}
                    <ul>
                        {currentCars.length > 0 ? (
                            currentCars.map((car, index) => (
                                <li key={index} className="car-item">
                                    <span>{index + 1}. {car.name} {car.model} {car.price} {car.year_manufacture}
                                    </span>
                                </li>
                            ))
                        ) : (
                            <p>Không có xe ô tô nào được tìm thấy.</p>
                        )}
                    </ul>
                </div>

                {/* Phân trang */}
                <div className="pagination">
                    <button onClick={handlePrevPage} disabled={currentPage <= 0}>Trang trước</button>
                    <button onClick={handleNextPage}>Trang tiếp theo</button>
                </div>
            </div>

        </div>
    );
};

export default CarList;
