import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../Header/Header';
import { Hero } from '../Hero/Hero';
import { Footer } from '../Footer/Footer';
import './chitiet.css';
import axios from 'axios';
import fc2 from '../assets/fc1.png';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export const CarDetail = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const [car, setCar] = useState(null); // Lưu thông tin chi tiết xe
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const [error, setError] = useState(null); // Trạng thái lỗi
    const [open, setOpen] = useState(false); // Trạng thái mở modal
    const [thumbnailUrl, setThumbnailUrl] = useState(null); // Lưu URL ảnh thumbnail

    // API URL với ID của xe
    const API_URL = `http://localhost:8088/api/v1/car/`;

    const FIXED_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJwaG9uZU51bWJlciI6ImFiYzEyMyFAIyIsInN1YiI6ImFiYzEyMyFAIyIsImV4cCI6MTczNDM1ODY0M30.Xx4ovaVcacu_6sfePLCWjIvOIwOfkOmTSDtpW6tBUoc';

    // Lấy thông tin chi tiết của xe từ API
    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}${id}`, {
                    headers: {
                        Authorization: `Bearer ${FIXED_TOKEN}`, // Thêm token vào header
                    },
                });
                setCar(response.data); // Lưu dữ liệu xe
                fetchCarThumbnail(response.data.car.thumbnail); // Lấy ảnh thumbnail
            } catch (err) {
                console.error('Error fetching car details:', err.message); // In lỗi ra console
                setError(err.response?.data?.message || 'Failed to fetch car details');
            } finally {
                setLoading(false); // Đặt trạng thái loading là false
            }
        };
        const fetchCarThumbnail = async (thumbnail) => {
            if (!thumbnail) return; // Nếu không có thumbnail thì không làm gì cả
            try {
                const imageResponse = await axios.get(
                    `http://localhost:8088/api/v1/car/images/${thumbnail}`,
                    {
                        responseType: 'blob', // Nhận dữ liệu dưới dạng file nhị phân
                        headers: {
                            Authorization: `Bearer ${FIXED_TOKEN}`,
                        },
                    }
                );
                const imageUrl = URL.createObjectURL(imageResponse.data);
                setThumbnailUrl(imageUrl); // Lưu URL ảnh tạm thời
            } catch (err) {
                console.error('Error fetching car thumbnail:', err.message);
            }
        };
        fetchCarDetails();
    }, [id, API_URL]);

    if (loading) {
        return <p>Loading car details...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!car) {
        return <p>Car not found</p>;
    }

    return (
        <div>
            <Header />
            <Hero />

            <div className="car-detail-sidebar">
                <h2>Thông tin cơ bản</h2>
                <span>Đây là một mẫu xe mới. Nhấn nút "Xem chi tiết" để xem đầy đủ thông tin!</span>
                <p><strong>Price:</strong> {car.car.price}</p>
                <p><strong>Location:</strong> {car.location || 'Unknown'}</p>
            </div>

            <div className="car-detail-container">
                <h1>{car.car.name}</h1>
               {/* Thẻ img mới để hiển thị ảnh từ API */}
               {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt="Car Thumbnail" className="car-thumbnail" />
                ) : (
                    <p>Ảnh xe chưa khả dụng</p>
                )}
                <p><strong>Year:</strong> {car.car.year_manufacture}</p>
                <p><strong>Model:</strong> {car.car.model}</p>

                {/* Nút mở modal */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpen(true)}
                >
                    Xem chi tiết
                </Button>

                {/* Modal hiển thị thông tin */}
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Thông tin chi tiết xe</DialogTitle>
                    <DialogContent>
                        <table className="car-detail-table">
                            <thead>
                                <tr>
                                    <th>Thông số</th>
                                    <th>Giá trị</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Manufacturer</td>
                                    <td>{car.manufacturer || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td>Price</td>
                                    <td>{car.car.price}</td>
                                </tr>
                                <tr>
                                    <td>Year of Manufacture</td>
                                    <td>{car.car.year_manufacture}</td>
                                </tr>
                                <tr>
                                    <td>Model</td>
                                    <td>{car.car.model}</td>
                                </tr>
                                {/* Thông số kỹ thuật */}
                                {car.specificationResponseDTOS.map((spec) => (
                                    <React.Fragment key={spec.id}>
                                        <tr>
                                            <td colSpan="2"><strong>{spec.name}</strong></td>
                                        </tr>
                                        {spec.attributes.map((attribute) => (
                                            <tr key={attribute.id}>
                                                <td>{attribute.name}</td>
                                                <td>{attribute.value}</td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)} color="secondary">
                            Đóng
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

            <Footer />
        </div>
    );
};

export default CarDetail;
