// import React, { useState } from 'react';
// import Box from '@mui/material/Box';
// import Container from '@mui/material/Container';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import { useSelector } from 'react-redux';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import './SearchCar.style.css';

// export const SearchCar = () => {
//     const theme = useSelector((state) => state.theme.value);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [cars, setCars] = useState([]); // Mảng chứa danh sách xe
//     const [loading, setLoading] = useState(false); // Trạng thái loading
//     const [error, setError] = useState(''); // Lỗi nếu có
//     const [isSearchVisible, setIsSearchVisible] = useState(false); // Trạng thái hiển thị bảng tìm kiếm

//     // Hàm xử lý khi thay đổi giá trị ô input
//     const handleInputChange = (e) => {
//         setSearchQuery(e.target.value);
//     };

//     // Hàm xử lý tìm kiếm
//     const handleSearch = async () => {
//         if (!searchQuery) {
//             alert('Vui lòng nhập từ khóa tìm kiếm');
//             return;
//         }
//         setLoading(true);
//         setError('');
//         try {
//             const response = await axios.get(
//                 `http://localhost:8088/api/v1/car/searchCar?keyword=${searchQuery}&page=0&limit=10&sort=name&direction=ASC`
//             );
//             console.log('tim', response.data.content);

//             // Kiểm tra xem dữ liệu trả về có đúng là mảng không
//             if (Array.isArray(response.data.content)) {
//                 setCars(response.data.content); // Cập nhật danh sách xe
//                 setIsSearchVisible(true); // Hiển thị bảng kết quả
//             } else {
//                 setCars([]); // Nếu không phải mảng, gán mảng rỗng
//                 setError('Dữ liệu không hợp lệ');
//             }
//         } catch (error) {
//             setError('Có lỗi xảy ra khi tìm kiếm');
//         }
//         setLoading(false);
//     };

//     // Hàm đóng bảng tìm kiếm
//     const closeSearchTable = () => {
//         setIsSearchVisible(false);
//     };

//     return (
//         <Container className="search">
//             <Box
//                 className="search__box"
//                 sx={{
//                     display: 'flex',
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     background: 'white',
//                     boxShadow: 4,
//                     borderRadius: '3px',
//                     padding: 2,
//                     gap: '20px',
//                 }}
//             >
//                 <h2 style={{ whiteSpace: 'nowrap', marginRight: 8 }}>Tìm kiếm oto</h2>
//                 <TextField
//                     variant="outlined"
//                     placeholder="Enter car model, brand, or year"
//                     value={searchQuery}
//                     onChange={handleInputChange}
//                     sx={{ marginRight: 1, width: '300px', flexGrow: 1 }}
//                 />
//                 <Button
//                     style={{ background: theme, color: 'white' }}
//                     className="search__btn"
//                     variant="contained"
//                     onClick={handleSearch}
//                     disabled={loading}
//                 >
//                     {loading ? 'Đang tìm kiếm...' : 'Tìm'}
//                 </Button>
//             </Box>

//             {/* Hiển thị kết quả tìm kiếm */}
//             {isSearchVisible && (
//                 <div className="table-container">
//                     <button className="close-btn" onClick={closeSearchTable}>
//                         X
//                     </button>
//                     {error && <p className="error">{error}</p>}
//                     {cars && cars.length > 0 ? (
//                         <table className="table">
//                             <thead>
//                                 <tr>
//                                     <th>Tên Xe</th>
//                                     <th>Model</th>
//                                     <th>Năm Sản Xuất</th>
//                                     <th>Hành Động</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {cars.map((car) => (
//                                     <tr key={car.id}>
//                                         <td>{car.name}</td>
//                                         <td>{car.model}</td>
//                                         <td>{car.year_manufacture}</td>
//                                         <td>
//                                             <Link to={`/car/${car.id}`}>
//                                                 <button className="detail-btn">Chi tiết</button>
//                                             </Link>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     ) : (
//                         <p></p>
//                     )}
//                 </div>
//             )}
//         </Container>
//     );
// };

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
                `http://localhost:8088/api/v1/car/searchCar?keyword=${searchQuery}&page=0&limit=10&sort=name&direction=ASC`
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
                <h2 style={{ whiteSpace: 'nowrap', marginRight: 8 }}>Tìm kiếm oto</h2>
                <TextField
                    variant="outlined"
                    placeholder="Enter car model, brand, or year"
                    value={searchQuery}
                    onChange={handleInputChange}
                    sx={{ marginRight: 1, width: '250px', flexGrow: 1 }}
                />
                <Button
                    style={{ background: theme, color: 'white' }}
                    className="search__btn"
                    variant="contained"
                    onClick={handleSearch}
                    disabled={loading}
                >
                    {loading ? 'Đang tìm kiếm...' : 'Tìm'}
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
