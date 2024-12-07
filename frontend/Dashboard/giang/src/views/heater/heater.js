import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Header.scss'; // Import file SCSS
import logo from '../../assets/images/anh.jpg';
import logo1 from '../../assets/images/active.png';
import logo2 from '../../assets/images/circle.png';

const Header = () => {
    const [searchQuery, setSearchQuery] = useState("");  // State cho từ khóa tìm kiếm
    const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
    const [error, setError] = useState(null); // Trạng thái lỗi khi tìm kiếm
    const [page, setPage] = useState(0); // Trang hiện tại
    const [limit, setLimit] = useState(10); // Số lượng kết quả mỗi trang
    const navigate = useNavigate();  // Hook dùng để điều hướng tới các trang khác

    // Hàm gọi API để tìm kiếm xe ô tô
    const searchCars = async (keyword, page, limit) => {
        setLoading(true); // Đánh dấu đang tải
        setError(null); // Reset lỗi cũ
        try {
            const response = await axios.get('http://localhost:8088/api/v1/car/searchCar', {
                params: {
                    keyword,
                    page,
                    limit,
                    sort: 'name',
                    direction: 'ASC'
                }
            });
            console.log('Dữ liệu từ API:', response.data);
            console.log('API params:', { keyword, page, limit });


            if (response.data && response.data.content) {
                const cars = response.data.content;  // Dữ liệu ô tô
                navigate('/admin/carlist', {
                    state: { cars, searchQuery, page, limit } // Truyền vào state của navigate
                });
            } else {
                setError("Không tìm thấy dữ liệu ô tô.");
            }
        } catch (err) {
            setError('Đã xảy ra lỗi khi tìm kiếm');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý khi người dùng thay đổi giá trị trong ô tìm kiếm
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Xử lý khi nhấn nút tìm kiếm
    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            searchCars(searchQuery, page, limit); // Gọi hàm tìm kiếm
        } else {
            console.log("Vui lòng nhập từ khóa tìm kiếm.");
        }
    };

    // Xử lý khi nhấn Enter trong ô tìm kiếm
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    return (
        <div>
            <div className="header">
                <div className="logo">
                    <img src={logo} alt="Logo" className="logo-image" />
                    <div className="logo-text">Dashboard</div>
                </div>

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyPress}
                        className="search-input"
                    />
                    <button className="timkiem" onClick={handleSearchSubmit}>Tìm kiếm</button>
                </div>
                <div className="header-icons">
                    <img src={logo1} alt="Icon 1" />
                    <img src={logo2} alt="Icon 2" />
                </div>
            </div>
        </div>
    );
};

export default Header;
