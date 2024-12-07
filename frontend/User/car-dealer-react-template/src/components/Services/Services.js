import React, { useState, useEffect, forwardRef } from 'react';
import './Services.style.css';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const Services = forwardRef(({ selectedCars, onRemoveCar }, ref) => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [iselectedCars, setSelectedCars] = useState([]);
  // Lưu trữ các xe đã chọn để so sánh

  // Lấy danh sách tất cả các xe từ API
  const fetchCarsList = async () => {
    try {
      let allCars = [];
      let page = 1;
      let hasNextPage = true;

      while (hasNextPage) {
        const response = await axios.get(`http://localhost:8088/api/v1/car?page=${page}&limit=1`); // Điều chỉnh số lượng xe lấy về mỗi trang
        allCars = [...allCars, ...response.data.cars];

        if (response.data.hasNextPage) {
          page++;
        } else {
          hasNextPage = false;
        }
      }

      return allCars;
    } catch (error) {
      setError('Lỗi khi lấy danh sách xe');
      console.error('Lỗi khi lấy danh sách xe:', error);
    }
  };

  // Lấy thông tin chi tiết của một xe
  const fetchCarDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8088/api/v1/car/${id}`);
      return {
        id: response.data.car.id,
        name: response.data.car.name,
        model: response.data.car.model,
        price: response.data.car.price,
        thumbnail: response.data.car.thumbnail || 'https://via.placeholder.com/150',
        specifications: response.data.specificationResponseDTOS.map((spec) => ({
          name: spec.name,
          attributes: spec.attributes.map((attr) => ({
            name: attr.name,
            value: attr.value,
          })),
        })),
      };
    } catch (error) {
      setError('Lỗi khi lấy chi tiết xe');
      console.error('Lỗi khi lấy chi tiết xe:', error);
    }
  };

  // Lấy thông tin chi tiết của tất cả các xe
  const fetchAllCarDetails = async () => {
    try {
      const carsList = await fetchCarsList();
      const carDetailsPromises = carsList.map((car) => fetchCarDetails(car.id));
      const carDetails = await Promise.all(carDetailsPromises);

      setServices(carDetails);
      setFilteredServices(carDetails);
    } catch (error) {
      setError('Lỗi khi lấy dữ liệu chi tiết xe');
    } finally {
      setLoading(false);
    }
  };

  // Lấy dữ liệu xe khi component được mount
  useEffect(() => {
    fetchAllCarDetails();
  }, [selectedCars]); // Chạy một lần khi mount

  // Xử lý chức năng tìm kiếm
  const handleSearch = async (event) => {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm.trim() === '') {
      setFilteredServices([]); // Xóa kết quả tìm kiếm khi ô tìm kiếm trống
      return;
    }

    try {
      const response = await axios.get('http://localhost:8088/api/v1/car/searchCar', {
        params: {
          keyword: searchTerm,
          page: 1,
          limit: 6,
          sort: 'name',
          direction: 'ASC',
        }
      });

      if (response.data && response.data.content) {
        const carDetailsPromises = response.data.content.map((car) => fetchCarDetails(car.id));
        const carDetails = await Promise.all(carDetailsPromises);
        setFilteredServices(carDetails);
      } else {
        setFilteredServices([]);
      }
    } catch (error) {
      setError('Lỗi trong quá trình tìm kiếm');
      console.error('Lỗi trong quá trình tìm kiếm:', error);
    }
  };

  // Thêm xe vào danh sách so sánh
  const handleAddCarToComparison = (car) => {
    if (iselectedCars.length < 4 && !iselectedCars.includes(car)) {
      setSelectedCars([...iselectedCars, car]);
    }
  };

  // Xóa xe khỏi danh sách so sánh
  const handleRemoveCarFromComparison = (carId) => {
    setSelectedCars(iselectedCars.filter((car) => car.id !== carId));
  };

  // Render bảng so sánh
  const renderComparisonTable = () => {
    if (iselectedCars.length === 0) {
      return <div>Chưa có xe nào được chọn để so sánh</div>;
    }

    const attributesMap = {};
    iselectedCars.forEach((car) => {
      car.specifications.forEach((spec) => {
        spec.attributes.forEach((attr) => {
          if (!attributesMap[attr.name]) {
            attributesMap[attr.name] = {};
          }
          attributesMap[attr.name][car.id] = attr.value;
        });
      });
    });

    const attributeNames = Object.keys(attributesMap);
    return (
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Thuộc tính</th>
            {iselectedCars.map((car) => (
              <th key={car.id}>
                {car.name}
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleRemoveCarFromComparison(car.id)}
                  style={{ marginLeft: '10px' }}
                >
                  Xóa
                </Button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {attributeNames.map((attribute) => (
            <tr key={attribute}>
              <td>{attribute}</td>
              {iselectedCars.map((car) => (
                <td key={`${car.id}-${attribute}`}>
                  {attributesMap[attribute][car.id] || 'Không có dữ liệu'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section id="service" className="service-section" ref={ref}>
      <div className="service-container">
        <div className="service-header">
          <h2 className="service-title">So sánh xe</h2>
        </div>
        {showComparison && (
          <div className="service-content">{renderComparisonTable()}</div>
        )}
        <div className="service-footer">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowSearch(true)}
          >
            Thêm xe
          </Button>
        </div>
        {showSearch && <div className="overlay" onClick={() => setShowSearch(false)}></div>}
        {showSearch && (
          <div className="search-box">
            <TextField
              label="Tìm kiếm xe"
              variant="outlined"
              fullWidth
              onChange={handleSearch}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowSearch(false)}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                if (filteredServices.length > 0) {
                  handleAddCarToComparison(filteredServices[0]);
                }
                setShowSearch(false);
              }}
            >
              Thêm
            </Button>
          </div>
        )}
        <div className="service-content" ref={ref}>
          {filteredServices.map((service, index) => (
            <div className="single-service-item" key={index} >
              <div className="service-image-container">
                <img
                  src={service.thumbnail}
                  alt={service.name}
                  className="service-image"
                />
              </div>
              <h3 className="service-name">{service.name}</h3>
              <p>Giá: {service.price}</p>
              <Button onClick={() => onRemoveCar(service.id)}>Xóa khỏi so sánh</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddCarToComparison(service)}
                disabled={iselectedCars.length >= 4 || iselectedCars.includes(service)}
              >
                {iselectedCars.includes(service) ? 'Đã chọn' : 'Thêm vào so sánh'}
              </Button>
            </div>
          ))}
        </div>
        <div className="service-footer">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowComparison(true)}
          >
            So sánh
          </Button>
        </div>
      </div>

      {/* Dialog so sánh */}
      <Dialog
        open={showComparison}
        onClose={() => setShowComparison(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>So sánh xe</DialogTitle>
        <DialogContent>{renderComparisonTable()}</DialogContent>
        <DialogActions>
          <Button onClick={() => setShowComparison(false)} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
});

export default Services;
