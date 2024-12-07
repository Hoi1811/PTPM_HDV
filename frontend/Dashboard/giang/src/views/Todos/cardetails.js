import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './cardetial.scss'
import Header from '../heater/heater';
import Nav from '../nav/Nav';

const CarDetail = () => {
    const [carDetails, setCarDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const [expandedSpecs, setExpandedSpecs] = useState({}); // Để theo dõi các mục nào đang mở

    useEffect(() => {
        const fetchCarDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`http://localhost:8088/api/v1/car/${id}`);
                setCarDetails(res.data);
            } catch (error) {
                setError('Lỗi khi tải dữ liệu xe. Vui lòng thử lại sau.');
                console.error('Error fetching car details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCarDetails();
    }, [id]);

    // Kiểm tra nếu có lỗi
    if (error) {
        return <div>{error}</div>;
    }

    // Hiển thị Loading khi chưa có dữ liệu
    if (loading) {
        return <div>Loading...</div>;
    }

    const { car, specificationResponseDTOS } = carDetails || {};

    // Nếu không có dữ liệu xe
    if (!car) {
        return <div>Không tìm thấy thông tin xe.</div>;
    }

    // Hàm để toggle các nhóm thông số kỹ thuật
    const toggleSpec = (specId) => {
        setExpandedSpecs((prev) => ({
            ...prev,
            [specId]: !prev[specId],
        }));
    };

    return (
        <>
            <Header />
            <Nav />
            <div className="car-detail-container">
                <h1>{car.name} - {car.model}</h1>
                <p><strong>Giá:</strong> {car.price}</p>
                <p><strong>Năm Sản Xuất:</strong> {car.year_manufacture}</p>

                {/* Hiển thị thông tin nhà sản xuất */}
                {car.manufacturer ? (
                    <p><strong>Nhà Sản Xuất:</strong> {car.manufacturer.name}</p>
                ) : (
                    <p><strong>Nhà Sản Xuất:</strong> Không có thông tin</p>
                )}

                {/* Hiển thị thông số kỹ thuật */}
                {specificationResponseDTOS && specificationResponseDTOS.length > 0 ? (
                    <div className="specs-container">
                        {specificationResponseDTOS.map((spec, index) => (
                            <div key={spec.id} className="spec-group">
                                <div
                                    className="spec-header"
                                    onClick={() => toggleSpec(spec.id)}
                                >
                                    {index + 1}. {spec.name}
                                    <span className="toggle-btn">{expandedSpecs[spec.id] ? '▲' : '▼'}</span>
                                </div>
                                {expandedSpecs[spec.id] && spec.attributes.length > 0 && (
                                    <ul className="spec-details">
                                        {spec.attributes.map((attr) => (
                                            <li key={attr.id}>
                                                <strong>{attr.name}:</strong> {attr.value}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Thông số kỹ thuật không có sẵn</p>
                )}
            </div>
        </>
    );
};

export default CarDetail;
