import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './chitiet.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Header } from '../Header/Header';

export const CarDetail = () => {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
    const [filteredCars, setFilteredCars] = useState([]);
    const [compareCars, setCompareCars] = useState([]);
    const [comparisonData, setComparisonData] = useState({});
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const apiURL = process.env.REACT_APP_API_BASE_URL;
    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                
                const response = await axios.get( `${apiURL}car/${id}`);
                const carData = response.data.car;

                // Lấy thông tin chi tiết xe
                const carDetails = {
                    id: carData.id,
                    name: carData.name,
                    model: carData.model,
                    price: carData.price,
                    thumbnail: carData.thumbnail || 'https://via.placeholder.com/150',
                    specifications: response.data.specificationResponseDTOS?.map((spec) => ({
                        name: spec.name,
                        attributes: spec.attributes?.map((attr) => ({
                            name: attr.name,
                            value: attr.value,
                        })) || [],
                    })) || [],
                };

                // Lấy ảnh từ API nếu có thumbnail
                if (carData.thumbnail) {
                    try {
                        const imageResponse = await axios.get(
                            `${apiURL}car/images/${carData.thumbnail}`,
                            { responseType: 'blob' }
                        );
                        const imageUrl = URL.createObjectURL(imageResponse.data);
                        carDetails.thumbnail = imageUrl;
                    } catch (imageError) {
                        console.error('Error fetching car image:', imageError);
                    }
                }

                setCar(carDetails);
            } catch (error) {
                console.error('Error fetching car details:', error);
            }
        };
        fetchCarDetails();
    }, [id]);


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
            console.error('Error searching cars:', error);
        }
    };

    const handleAddToComparison = async (carToAdd) => {
        if (car && !compareCars.some((existingCar) => existingCar.id === carToAdd.id)) {
            try {
                const response = await axios.get(`${apiURL}car/${carToAdd.id}`);
                const carDetails = {
                    id: response.data.car.id,
                    name: response.data.car.name,
                    model: response.data.car.model,
                    price: response.data.car.price,
                    specifications: response.data.specificationResponseDTOS?.map((spec) => ({
                        name: spec.name,
                        attributes: spec.attributes?.map((attr) => ({
                            name: attr.name,
                            value: attr.value,
                        })) || [],
                    })) || [],
                };
                setCompareCars((prevCars) => [...prevCars, carDetails]);
            } catch (error) {
                console.error('Error adding car to comparison:', error);
            }
        }
    };

    const handleRemoveFromComparison = (carId) => {
        setCompareCars((prevCars) => prevCars.filter((car) => car.id !== carId));
    };

    const handleShowComparison = () => {
        setComparisonData({
            initialCar: car,
            compareCars,
        });
        setIsCompareModalOpen(false);
    };

    const handleCloseModal = () => {
        setIsCompareModalOpen(false);
    };

    const handleShowCarDetails = () => {
        setIsDetailVisible(!isDetailVisible);
    };

    const toggleSpecification = (specName) => {
        const updatedCar = { ...car };
        updatedCar.specifications = updatedCar.specifications.map((spec) => {
            if (spec.name === specName) {
                spec.showAttributes = !spec.showAttributes;
            }
            return spec;
        });
        setCar(updatedCar);
    };
    return (
        <>
            <Header />
            <div className='container_car'>
                <div className="car-detail">

                    {car ? (
                        <Box>
                            <div className="car-detail__header">
                                <h2>{car.name}</h2>
                                <p>Model: {car.model}</p>
                                <p>Price: {car.price}</p>
                            </div>
                            <div className="car-detail__image">
                                <img src={car.thumbnail} alt={car.name} />
                            </div>
                            <Box sx={{ display: 'flex', gap: 2, marginTop: 3 }}>
                                <Button variant="contained" onClick={() => setIsCompareModalOpen(true)}>
                                    So Sánh
                                </Button>
                                <Button variant="outlined" onClick={handleShowCarDetails}>
                                    {isDetailVisible ? 'Ẩn' : 'Thông số chi tiết'}
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <p>Loading car details...</p>
                    )}

                    {isDetailVisible && car && (
                        <Box sx={{ marginTop: 3 }}>
                            <h3>Thông số xe</h3>
                            <table className="car-detail__details">
                                <thead>
                                    <tr>
                                        <th>Thông số kỹ thuật</th>
                                        <th>Chi tiết</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {car.specifications?.map((spec) => (
                                        <React.Fragment key={spec.name}>
                                            <tr>
                                                <td
                                                    className="specification-row"
                                                    onClick={() => toggleSpecification(spec.name)}
                                                    style={{
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <span>{spec.name}</span>
                                                    <span>{spec.showAttributes ? '−' : '+'}</span>
                                                </td>
                                                <td></td>
                                            </tr>
                                            {spec.showAttributes && spec.attributes.map((attr) => (
                                                <tr key={`${spec.name}-${attr.name}`}>
                                                    <td style={{ paddingLeft: '40px', fontStyle: 'italic' }}>{attr.name}</td>
                                                    <td>{attr.value}</td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>

                            </table>
                        </Box>
                    )}

                    {/* Compare Modal */}
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
                            overflowY: 'auto',
                            maxHeight: '90vh',
                        }}>
                            <h2>Tìm kiếm</h2>
                            <TextField
                                fullWidth
                                // label="Search cars"
                                placeholder="Enter car name or model"
                                onChange={handleSearchChange}
                                sx={{ marginBottom: 2 }}
                            />

                            <Box>
                                {filteredCars.map((filteredCar) => (
                                    <Box
                                        key={filteredCar.id}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '8px',
                                            borderBottom: '1px solid #ddd',
                                        }}
                                    >
                                        <span>{filteredCar.name} - {filteredCar.model}</span>
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleAddToComparison(filteredCar)}
                                        >
                                            Thêm
                                        </Button>
                                    </Box>
                                ))}
                            </Box>

                            <h3>Những chiếc xe bạn chọn:</h3>
                            {compareCars.length > 0 ? (
                                compareCars.map((compareCar) => (
                                    <Box
                                        key={compareCar.id}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '8px',
                                            borderBottom: '1px solid #ddd',
                                        }}
                                    >
                                        <span>{compareCar.name} - {compareCar.model}</span>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleRemoveFromComparison(compareCar.id)}
                                        >
                                            Xoá
                                        </Button>
                                    </Box>
                                ))
                            ) : (
                                <p>Không chiếc xe nào được chọn.</p>
                            )}

                            <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                                <Button variant="contained" onClick={handleShowComparison}>
                                    So sánh
                                </Button>
                            </Box>
                        </Box>
                    </Modal>

                    {comparisonData.initialCar && comparisonData.compareCars.length > 0 && (
                        <Box sx={{ marginTop: 3 }}>
                            <h3>Bảng so sánh</h3>
                            <table className="comparison-table">
                                <thead>
                                    <tr>
                                        <th>Thuộc tính</th>
                                        <th>{comparisonData.initialCar.name}</th>
                                        {comparisonData.compareCars.map((compareCar) => (
                                            <th key={compareCar.id}>{compareCar.name}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisonData.initialCar.specifications?.flatMap((spec) =>
                                        spec.attributes.map((attr) => (
                                            <tr key={`${spec.name}-${attr.name}`}>
                                                <td>{`${spec.name}: ${attr.name}`}</td>
                                                <td>{attr.value}</td>
                                                {comparisonData.compareCars.map((compareCar) => {
                                                    const compareSpec = compareCar.specifications.find(
                                                        (s) => s.name === spec.name
                                                    );
                                                    const compareAttr = compareSpec?.attributes.find(
                                                        (a) => a.name === attr.name
                                                    );
                                                    return <td key={`${compareCar.id}-${attr.name}`}>{compareAttr?.value || '-'}</td>;
                                                })}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => setComparisonData({})}
                                sx={{ marginTop: 2 }}
                            >
                                Đóng
                            </Button>
                        </Box>

                    )}
                </div>
            </div>

        </>
    );
};

export default CarDetail;
