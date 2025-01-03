import React, { useState, useEffect, useRef } from 'react';
import './SearchCar.style.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import axios from 'axios'; // Sử dụng axios để gửi yêu cầu API
import TextField from '@mui/material/TextField';
import Header from '../Header/Header';
export const SearchCar = ({ onAddCarToComparison, scrollToServices }) => {
    const [cars, setCars] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
    const [initialCar, setInitialCar] = useState(null);
    const apiURL = process.env.REACT_APP_API_BASE_URL;

    const [filteredCars, setFilteredCars] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // New state to hold the search term

    const containerRef = useRef(null);
    const itemsPerPage = 9;
    const [comparisonData, setComparisonData] = useState({
        initialCar: {
            name: '',
            model: '',
            price: '',
            year_manufacture: '',
            specificationResponseDTOS: [],
        },
    });

    const [compareCars, setCompareCars] = useState([]);


    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await axios.get(`${apiURL}car?page=${currentPage}&limit=${itemsPerPage}`);
                const carsData = await Promise.all(
                    response.data.content.map(async (car) => {
                        try {
                            const imageResponse = await axios.get(`${apiURL}car/images/${car.thumbnail}`, {
                                responseType: 'blob',
                            });
                            const imageUrl = URL.createObjectURL(imageResponse.data);
                            return { ...car, image: imageUrl };
                        } catch (error) {
                            console.error(`Lỗi khi lấy ảnh xe với ID ${car.id}:`, error);
                            return {};
                        }
                    })
                );
                setCars(carsData);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu xe:", error);
            }
        };
        fetchCars();
    }, [currentPage]);

    // Lấy thông tin chi tiết của một xe
    const fetchCarDetails = async (id) => {
        try {
            const response = await axios.get(`${apiURL}car/${id}`);
            return {
                id: response.data.car.id,
                name: response.data.car.name,
                model: response.data.car.model,
                price: response.data.car.price,
                thumbnail: response.data.car.thumbnail || 'https://via.placeholder.com/150',
                specifications: response.data.specificationResponseDTOS?.map((spec) => ({
                    name: spec.name,
                    attributes: spec.attributes?.map((attr) => ({
                        name: attr.name,
                        value: attr.value,
                    })) || [],
                })) || [],
            };
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết xe:', error);
        }
    };

    // Hàm xử lý tìm kiếm khi người dùng thay đổi từ khóa tìm kiếm
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase().trim()); // Cập nhật từ khóa tìm kiếm
    };

    // Hàm xử lý khi người dùng nhấn nút tìm kiếm
    const handleSearchClick = async () => {
        if (!searchTerm) {
            // Nếu không có từ khóa, reset danh sách xe
            return;
        }

        try {
            const response = await axios.get(`${apiURL}car/searchCar`, {
                params: {
                    keyword: searchTerm,
                    page: 0,
                    limit: 9,
                    sort: 'id',
                    direction: 'ASC',
                },
            });
            const carsData = await Promise.all(
                response.data.content.map(async (car) => {
                    try {
                        const imageResponse = await axios.get(`${apiURL}car/images/${car.thumbnail}`, {
                            responseType: 'blob',
                        });
                        const imageUrl = URL.createObjectURL(imageResponse.data);
                        return { ...car, image: imageUrl };
                    } catch (error) {
                        console.error(`Lỗi khi lấy ảnh xe với ID ${car.id}:`, error);
                        return {};
                    }
                })
            );
            setCars(carsData);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Lỗi khi gọi API tìm kiếm:", error);
        }
    };

    const handleCompareClick = async (car) => {
        setInitialCar(car);
        // Lấy thông tin chi tiết của xe ban đầu
        const carDetails = await fetchCarDetails(car.id);
        setInitialCar(carDetails); // Lưu thông tin chi tiết vào state
        setIsCompareModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsCompareModalOpen(false);
    };

    const handleAddToComparison = async (car) => {
        if (initialCar && !compareCars.some((existingCar) => existingCar.id === car.id)) {
            try {
                const carDetails = await fetchCarDetails(car.id);
                setCompareCars((prevCars) => [...prevCars, carDetails]);
            } catch (error) {
                console.error('Lỗi khi thêm xe vào so sánh:', error);
            }
        } else if (!initialCar) {
            alert("Vui lòng chọn một xe ban đầu để so sánh!");
        }
    };

    const handleShowComparison = () => {
        if (initialCar && compareCars.length > 0) {
            setComparisonData({
                initialCar: initialCar,
                compareCar: compareCars[0], // Hiện tại chỉ hiển thị so sánh với một xe
            });
        }
    };

    const handleRemoveFromComparison = (carId) => {
        setCompareCars((prevCars) => prevCars.filter((car) => car.id !== carId));
    };

    const nextPage = () => {
        if (currentPage + 1 < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
            containerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prevPage) => prevPage - 1);
            containerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
       
        <section id="featured-cars" className="featured-cars" ref={containerRef}>
            <Header />
            <div className="featured-cars__container">
            <div className="search-container">
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                className="search-input"
                placeholder="Tìm kiếm xe..."
            />
            <button id="search-button" className="search-button" onClick={handleSearchClick}>
                Tìm Kiếm
            </button>
        </div>

                <div className="featured-cars__header">
                    <h2>Danh sách xe</h2>
                </div>
                <div className="featured-cars__content">
                    <Box sx={{ width: 1, padding: '0 0px' }}>
                        <Box className="featured-car__grid" display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
                            {cars.map((car) => (
                                <Box key={car.id} className="featured-car">
                                    <div className="featured-car__box">
                                        <Link to={`/car/${car.id}`}>
                                            <div className="featured-car__img">
                                                <img src={car.image} alt={car.title || "Car Thumbnail"} />
                                            </div>
                                            <div className="featured-car__info">
                                                <h3>{car.price}</h3>
                                                <p>{car.model}</p>
                                                <p>{car.year_manufacture}</p>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="featured-car__txt">
                                        <h2>
                                            <Link to={`/car/${car.id}`}><h1>{car.name}</h1></Link>
                                            <Button variant="contained" color="primary" onClick={() => handleCompareClick(car)}>
                                                So Sánh
                                            </Button>
                                        </h2>
                                    </div>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                    <Box className="pagination-buttons" display="flex" justifyContent="center" alignItems="center" mt={2}>
                        <Button onClick={prevPage} disabled={currentPage === 0}>
                            Previous
                        </Button>
                        <span style={{ margin: '0 16px' }}>Page {currentPage + 1} of {totalPages}</span>
                        <Button onClick={nextPage} disabled={currentPage + 1 === totalPages}>
                            Next
                        </Button>
                    </Box>
                </div>
            </div>

            {/* Modal So Sánh */}
            <Modal open={isCompareModalOpen} onClose={handleCloseModal}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    overflowY: 'auto', // Thêm cuộn dọc
                    maxHeight: '90vh'
                }}>
                    <h2>So Sánh Xe</h2>

                    {/* Close Button */}
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleCloseModal}
                        sx={{ position: 'absolute', top: 16, right: 16 }}
                    >
                        Đóng
                    </Button>


                    {/* Danh sách xe tìm kiếm được */}
                    {filteredCars.length > 0 && (
                        <Box className="compare-cars-list" display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
                            {filteredCars.map((car) => (
                                <Box key={car.id} className="car-item">
                                    <h3>{car.name}</h3>
                                    <Button onClick={() => handleAddToComparison(car)}>Thêm vào so sánh</Button>
                                </Box>
                            ))}
                        </Box>
                    )}

                    {/* Danh sách xe đã được chọn để so sánh */}
                    {compareCars.length > 0 && (
                        <Box className="compare-cars-list">
                            <h3>Danh sách xe đã chọn</h3>
                            {compareCars.map((car) => (
                                <Box key={car.id} className="car-item">
                                    <h4>{car.name}</h4>
                                    <Button onClick={() => handleRemoveFromComparison(car.id)} variant="outlined" color="error">
                                        Xóa
                                    </Button>
                                </Box>
                            ))}
                        </Box>
                    )}

                    {/* Show comparison button */}
                    <Button onClick={handleShowComparison} variant="contained" color="primary" sx={{ marginTop: 2 }}>
                        Hiển thị so sánh
                    </Button>
                </Box>
            </Modal>
        </section>
    );
}
export default SearchCar;