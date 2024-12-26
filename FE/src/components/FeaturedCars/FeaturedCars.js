import React, { useState, useEffect, useRef } from 'react';
import './FeaturedCars.style.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import axios from 'axios'; // Sử dụng axios để gửi yêu cầu API
import TextField from '@mui/material/TextField';

export const FeaturedCars = ({ onAddCarToComparison, scrollToServices }) => {
    const [cars, setCars] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

    const apiURL = process.env.REACT_APP_API_BASE_URL;

    const [filteredCars, setFilteredCars] = useState([]);
    const [initialCar, setInitialCar] = useState(null);

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


    const handleSearchChange = async (event) => {
        const searchTerm = event.target.value.toLowerCase().trim();
        if (!searchTerm) {
            setFilteredCars([]);
            return;
        }

        try {
            const response = await axios.get(`${apiURL}car/searchCar`, {
                params: {
                    keyword: searchTerm,
                    page: 0,
                    limit: 10,
                    sort: 'name',
                    direction: 'ASC',
                },
            });

            if (response.data && response.data.content && response.data.content.length > 0) {
                setFilteredCars(response.data.content);
            } else {
                setFilteredCars([]);
            }
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
        console.log('Initial Car Specifications:', comparisonData.initialCar.specificationResponseDTOS);
        console.log('Compare Cars Specifications:', compareCars);

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

    return (
        <section id="featured-cars" className="featured-cars" ref={containerRef}>
            <div className="featured-cars__container">
                <div className="featured-cars__header">
                    <h2>Danh sách xe</h2>
                </div>
                <div className="featured-cars__content">
                    <Box sx={{ width: 1, padding: '0 100px' }}>
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

                    {/* Thanh tìm kiếm */}
                    <TextField fullWidth label="Tìm kiếm xe" placeholder="Nhập tên hoặc model xe để tìm kiếm" onChange={handleSearchChange} sx={{ marginBottom: 2 }} />

                    {/* Danh sách xe tìm kiếm */}
                    <Box>
                        {filteredCars.map((car) => (
                            <Box key={car.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>
                                <span>{car.name} - {car.model}</span>
                                <Button variant="outlined" onClick={() => handleAddToComparison(car)}>
                                    Thêm
                                </Button>
                            </Box>
                        ))}
                    </Box>

                    {/* Danh sách xe so sánh */}
                    <h3>Danh sách xe so sánh:</h3>
                    {compareCars.length > 0 ? (
                        compareCars.map((car) => (
                            <Box key={car.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>
                                <span>{car.name} - {car.model}</span>
                                <Button variant="outlined" color="error" onClick={() => handleRemoveFromComparison(car.id)}>
                                    Xóa
                                </Button>
                            </Box>
                        ))
                    ) : (
                        <p>Chưa có xe nào được chọn để so sánh.</p>
                    )}

                    <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                        <Button variant="contained" onClick={handleShowComparison}>
                            Hiển thị bảng
                        </Button>
                    </Box>

                    {comparisonData && (
                        <Box sx={{ marginTop: 3 }}>
                            <h3>Bảng So Sánh:</h3>
                            <div>
                                <table border="1" >
                                    <thead>
                                        <tr>
                                            <td><h4>Tên xe</h4></td>
                                            <td>{comparisonData.initialCar.name}</td>
                                            {compareCars.map((car) => (
                                                <td key={car.id}>{car.name}</td>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Model</td>
                                            <td>{comparisonData.initialCar.model}</td>
                                            {compareCars.map((car) => (
                                                <td key={car.id}>{car.model}</td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td>Giá</td>
                                            <td>{comparisonData.initialCar.price}</td>
                                            {compareCars.map((car) => (
                                                <td key={car.id}>{car.price}</td>
                                            ))}
                                        </tr>

                                        {/* Kiểm tra thông số của xe ban đầu */}
                                        {comparisonData.initialCar.specifications?.length > 0 ? (
                                            comparisonData.initialCar.specifications.map((spec) => (
                                                <React.Fragment key={spec.name}>
                                                    {/* Dòng đầu tiên hiển thị tên thông số */}
                                                    {spec.attributes.map((attr, index) => (
                                                        <tr key={`${spec.name}-${attr.name}`}>
                                                            {/* Hiển thị tên thông số một lần */}
                                                            {index === 0 && <td rowSpan={spec.attributes.length}>{spec.name}</td>}
                                                            {/* Hiển thị thuộc tính */}
                                                            <td>{`${attr.name}: ${attr.value}`}</td>

                                                            {/* Hiển thị thông số tương ứng của các xe khác */}
                                                            {compareCars.map((car) => (
                                                                <td key={car.id}>
                                                                    {car.specifications?.length > 0 ? (
                                                                        car.specifications.map((compSpec) => (
                                                                            compSpec.name === spec.name ? (
                                                                                <div key={compSpec.name}>
                                                                                    {compSpec.attributes.map((compAttr) => (
                                                                                        compAttr.name === attr.name ? (
                                                                                            <div key={compAttr.name}>
                                                                                                {compAttr.name}: {compAttr.value}
                                                                                            </div>
                                                                                        ) : null
                                                                                    ))}
                                                                                </div>
                                                                            ) : null
                                                                        ))
                                                                    ) : (
                                                                        <div>Không có thông số kỹ thuật.</div>
                                                                    )}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={compareCars.length + 1}>Không có thông số kỹ thuật.</td>
                                            </tr>
                                        )}

                                    </tbody>
                                </table>
                            </div>
                        </Box>
                    )}


                </Box>
            </Modal>
        </section>
    );
};
