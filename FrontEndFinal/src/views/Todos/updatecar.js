import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditCarForm.scss';

const UpdateCarForm = ({ selectedCar, onClose, onUpdateSuccess }) => {
    const [carData, setCarData] = useState({
        id: '',
        name: '',
        yearManufacturer: '',
        model: '',
        price: '',
        thumbnail: '',
        specifications: [], // Mảng để chứa các thông số kỹ thuật
    });
    const [expandedSpecs, setExpandedSpecs] = useState({}); // Quản lý trạng thái của thông số mở rộng
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedCar) {
            console.log("Thông số kỹ thuật của xe:", selectedCar.specifications);
            setCarData({
                id: selectedCar.id || '',
                name: selectedCar.name || '',
                model: selectedCar.model || '',
                price: selectedCar.price || '',
                thumbnail: selectedCar.thumbnail || '',
                yearManufacturer: selectedCar.yearManufacturer || '',
                specifications: selectedCar.specifications || [],
            });
        }
    }, [selectedCar]);
    console.log("Dữ liệu xe sau khi cập nhật state:", carData);


    // Hàm xử lý thay đổi trong các trường nhập liệu
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCarData({ ...carData, [name]: value });
    };

    const handleSpecificationChange = (e, specIndex) => {
        const { name, value } = e.target;
        const updatedSpecifications = [...carData.specifications];
        updatedSpecifications[specIndex][name] = value;
        setCarData({ ...carData, specifications: updatedSpecifications });
    };

    const handleAttributeChange = (e, specIndex, attrIndex) => {
        const { name, value } = e.target;
        const updatedSpecifications = [...carData.specifications];
        updatedSpecifications[specIndex].attributes[attrIndex][name] = value;
        setCarData({ ...carData, specifications: updatedSpecifications });
    };

    // Hàm toggle để mở hoặc thu gọn thông số kỹ thuật
    const toggleSpec = (specId) => {
        setExpandedSpecs((prev) => ({
            ...prev,
            [specId]: !prev[specId],
        }));
    };

    const validateForm = () => {
        const { name, yearManufacturer, price } = carData;
        if (!name || !yearManufacturer || !price) {
            setError('Vui lòng điền đầy đủ các trường bắt buộc!');
            return false;
        }
        return true;
    };

    const handleUpdateCar = async (e) => {
        e.preventDefault();
        setError(null);
        if (!validateForm()) {
            return;
        }
        setLoading(true);

        const updateCarData = {
            id: carData.id,
            name: carData.name,
            model: carData.model,
            price: carData.price.toString(),
            thumbnail: carData.thumbnail,
            yearManufacturer: carData.yearManufacturer,
            specifications: carData.specifications.map((spec) => ({
                id: spec.id, // ID của thông số kỹ thuật nếu có
                name: spec.name || '',
                attributes: spec.attributes.map((attribute) => ({
                    id: attribute.id,
                    specificationId: spec.id, // ID của thông số kỹ thuật
                    name: attribute.name || '',
                    value: attribute.value || '',
                })),
            })),
        };

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Vui lòng đăng nhập lại!');
                setLoading(false);
                return;
            }

            const response = await axios.put(
                `http://localhost:8088/api/v1/car/update`,
                updateCarData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            onUpdateSuccess();
            onClose();
            alert('Cập nhật xe thành công!');
            setError(null);
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'Không thể cập nhật xe');
                alert(error.response.data.message || 'Không thể cập nhật xe');
            } else {
                setError('Không thể kết nối tới server');
                alert('Lỗi kết nối tới server. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="update-car-form-overlay" onClick={onClose}>
            <div className="update-car-form" onClick={(e) => e.stopPropagation()}>
                <h3>Cập Nhật Thông Tin Xe</h3>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleUpdateCar}>
                    <div>
                        <label>Tên xe</label>
                        <input
                            type="text"
                            name="name"
                            value={carData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Model xe</label>
                        <input
                            type="text"
                            name="model"
                            value={carData.model}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Năm sản xuất</label>
                        <input
                            type="number"
                            name="yearManufacturer"
                            value={carData.yearManufacturer}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Giá</label>
                        <input
                            type="number"
                            name="price"
                            value={carData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Ảnh đại diện (Thumbnail)</label>
                        <input
                            type="text"
                            name="thumbnail"
                            value={carData.thumbnail}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Thông số kỹ thuật</label>
                        <div className="specs-container">
                            {carData.specifications.length > 0 ? (
                                carData.specifications.map((spec, index) => (
                                    <div key={index} className="spec-group">
                                        <div
                                            className="spec-header"
                                            onClick={() => toggleSpec(index)}
                                        >
                                            {index + 1}. {spec.name}
                                            <span className="toggle-btn">
                                                {expandedSpecs[index] ? '▲' : '▼'}
                                            </span>
                                        </div>
                                        {expandedSpecs[index] && (
                                            <ul className="spec-details">
                                                {spec.attributes.map((attribute, attrIndex) => (
                                                    <li key={attrIndex}>
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            placeholder="Tên thuộc tính"
                                                            value={attribute.name || ''}
                                                            onChange={(e) => handleAttributeChange(e, index, attrIndex)}
                                                        />
                                                        <input
                                                            type="text"
                                                            name="value"
                                                            placeholder="Giá trị thuộc tính"
                                                            value={attribute.value || ''}
                                                            onChange={(e) => handleAttributeChange(e, index, attrIndex)}
                                                        />
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        <div>
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Tên thông số"
                                                value={spec.name || ''}
                                                onChange={(e) => handleSpecificationChange(e, index)}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div>Không có thông số kỹ thuật</div>
                            )}
                        </div>
                    </div>


                    <button type="submit" disabled={loading}>
                        {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                    </button>
                    <button type="button" onClick={onClose}>
                        Hủy
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateCarForm;
