import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SearchCar.style.css'; // Import file CSS

export const SearchCar = () => {
    const theme = useSelector((state) => state.theme.value);
    const [searchQuery, setSearchQuery] = useState('');
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const apiURL = process.env.REACT_APP_API_BASE_URL;
    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };
    const handleSearch = async () => {
        if (!searchQuery) {
            alert('Vui lòng nhập từ khóa tìm kiếm');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(
                `${apiURL}car/searchCar?keyword=${searchQuery}&page=0&limit=10&sort=name&direction=ASC`
            );

            if (Array.isArray(response.data.content)) {
                setCars(response.data.content);
                setIsSearchVisible(true);
            } else {
                setCars([]);
                setError('Dữ liệu không hợp lệ');
            }
        } catch (error) {
            setError('Có lỗi xảy ra khi tìm kiếm');
        }
        setLoading(false);
    };

    const closeSearchTable = () => {
        setIsSearchVisible(false);
    };

    return (
        <Container className="search">
            <Box className="search__box">
                <TextField
                    variant="outlined"
                    placeholder="Nhập tên xe"
                    value={searchQuery}
                    onChange={handleInputChange}
                    sx={{
                        flexGrow: 1,
                        backgroundColor: '#f9f9f9',
                        borderRadius: '20px',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '20px',
                        },
                        '& input': {
                            padding: '6px 14px',
                        },
                    }}
                />
                <Button
                    className="search__btn"
                    variant="contained"
                    onClick={handleSearch}
                    disabled={loading}
                    sx={{
                        padding: '6px 12px',
                        borderRadius: '24px',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        background: loading ? '#ccc' : '#d3d3d3',
                        color: loading ? '#666' : 'white',
                        '&:hover': {
                            background: loading ? '#ccc' : 'darkblue',
                        },
                    }}
                >
                    {loading ? 'Đang tìm kiếm...' : 'Tìm kiếm'}
                </Button>
            </Box>

            {isSearchVisible && (
                <div className="table-container">
                    <button className="close-btn" onClick={closeSearchTable}>
                        X
                    </button>
                    {error && <p className="error">{error}</p>}
                    {cars && cars.length > 0 ? (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Tên Xe</th>
                                    <th>Model</th>
                                    <th>Năm Sản Xuất</th>
                                    <th>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cars.map((car) => (
                                    <tr key={car.id}>
                                        <td>{car.name}</td>
                                        <td>{car.model}</td>
                                        <td>{car.year_manufacture}</td>
                                        <td>
                                            <Link to={`/car/${car.id}`}>
                                                <button className="detail-btn">Chi tiết</button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Không tìm thấy kết quả</p>
                    )}
                </div>
            )}
        </Container>
    );
};
