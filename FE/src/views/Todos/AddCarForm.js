import React, { useState } from 'react';
import axios from 'axios';
import './addform.scss';  // Đảm bảo rằng CSS đã được import đúng

const AddCarForm = ({ onClose, onAddCarSuccess }) => {
    const [newCar, setNewCar] = useState({
        name: '',
        model: '',
        year_manufacture: '',
        price: '',
        thumbnail: '',
        manufacturer: {
            id: '',
            name: ''
        }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('manufacturer.')) {
            const field = name.split('.')[1];
            setNewCar(prevState => ({
                ...prevState,
                manufacturer: {
                    ...prevState.manufacturer,
                    [field]: value,
                }
            }));
        } else {
            setNewCar(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleAddCar = async () => {
        if (!newCar.name || !newCar.model || !newCar.year_manufacture || !newCar.price || !newCar.manufacturer.id || !newCar.manufacturer.name) {
            setError('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Vui lòng đăng nhập lại!');
                setLoading(false);
                return;
            }

            const response = await axios.post(
                'http://localhost:8088/api/v1/car/add',
                newCar,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            console.log('Thêm xe thành công:', response.data);
            onAddCarSuccess(response.data); // Gọi callback khi thêm thành công
            onClose(); // Đóng form
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error.response) {
                setError(error.response.data.message || 'Không thể thêm xe');
                alert(error.response.data.message || 'Không thể thêm xe');
            } else {
                setError('Không thể kết nối tới server');
                alert('Lỗi kết nối tới server. Vui lòng thử lại sau.');
            }
        }
    };

    return (
        <div className="add-car-form-overlay"> {/* Thêm lớp overlay */}
            <div className="add-car-form">
                <h3>Thêm xe mới</h3>
                {error && <div className="error-message">{error}</div>}
                <div>
                    <label>Tên xe:</label>
                    <input
                        type="text"
                        name="name"
                        value={newCar.name}
                        onChange={handleInputChange}
                        placeholder="Nhập tên xe"
                    />
                </div>
                <div>
                    <label>Model:</label>
                    <input
                        type="text"
                        name="model"
                        value={newCar.model}
                        onChange={handleInputChange}
                        placeholder="Nhập model xe"
                    />
                </div>
                <div>
                    <label>Năm sản xuất:</label>
                    <input
                        type="number"
                        name="year_manufacture"
                        value={newCar.year_manufacture}
                        onChange={handleInputChange}
                        placeholder="Nhập năm sản xuất"
                    />
                </div>
                <div>
                    <label>Giá:</label>
                    <input
                        type="number"
                        name="price"
                        value={newCar.price}
                        onChange={handleInputChange}
                        placeholder="Nhập giá xe"
                    />
                </div>
                <div>
                    <label>Link ảnh:</label>
                    <input
                        type="text"
                        name="thumbnail"
                        value={newCar.thumbnail}
                        onChange={handleInputChange}
                        placeholder="Nhập link ảnh"
                    />
                </div>
                <div>
                    <label>Manufacturer ID:</label>
                    <input
                        type="number"
                        name="manufacturer.id"
                        value={newCar.manufacturer.id}
                        onChange={handleInputChange}
                        placeholder="Nhập ID của hãng"
                    />
                </div>
                <div>
                    <label>Manufacturer Name:</label>
                    <input
                        type="text"
                        name="manufacturer.name"
                        value={newCar.manufacturer.name}
                        onChange={handleInputChange}
                        placeholder="Nhập tên hãng"
                    />
                </div>
                <div>
                    <button type="button" onClick={handleAddCar} disabled={loading}>
                        {loading ? 'Đang thêm xe...' : 'Thêm xe'}
                    </button>
                    <button type="button" onClick={onClose}>Hủy</button>
                </div>
            </div>
        </div>
    );
};

export default AddCarForm;
