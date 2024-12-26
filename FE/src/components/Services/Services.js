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
  const [showSearch, setShowSearch] = useState(false);
  const [showComparison, setShowComparison] = useState(false); // Hiển thị bảng so sánh
  const [selectedIndex, setSelectedIndex] = useState(null); // Chỉ số của vị trí đang thêm xe
  const [iselectedCars, setSelectedCars] = useState([null, null, null, null]); // Tối đa 4 xe, null cho các vị trí trống
  const apiURL = process.env.REACT_APP_API_BASE_URL;
  // Lấy danh sách tất cả các xe từ API
  const fetchCarsList = async () => {
    try {
      let allCars = [];
      let page = 0;
      let hasNextPage = true;

      while (hasNextPage) {
        const response = await axios.get(`${apiURL}car?page=${page}&limit=9`);
        console.log('Response:', response.data.content);
        if (Array.isArray(response.data.content)) {
          allCars = [...allCars, ...response.data.content];
          
          if (response.data.last === false) {
            page++;
          } else {
            hasNextPage = false;
          }
        } else {
          console.error('Dữ liệu trả về không phải mảng:', response.data.content);
          setError('Dữ liệu trả về không hợp lệ');
          break;
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
      const response = await axios.get(`${apiURL}car/${id}`);
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
  }, []);

  // Xử lý chức năng tìm kiếm
  const handleSearch = async (event) => {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm.trim() === '') {
      setFilteredServices([]); // Xóa kết quả tìm kiếm khi ô tìm kiếm trống
      return;
    }

    try {
      const response = await axios.get(`${apiURL}car/searchCar`, {
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

  // Thêm xe vào danh sách so sánh tại vị trí cụ thể
  const handleAddCarToComparison = (car) => {
    const updatedCars = [...iselectedCars];
    updatedCars[selectedIndex] = car;
    setSelectedCars(updatedCars);
    setShowSearch(false); // Đóng ô tìm kiếm
    setSelectedIndex(null); // Reset chỉ số
  };

  // Mở ô tìm kiếm cho vị trí cụ thể
  const handleOpenSearch = (index) => {
    setSelectedIndex(index);
    setShowSearch(true);
  };

  // Hiển thị bảng so sánh
  const renderComparisonTable = () => {
    const attributesMap = {};
    iselectedCars.forEach((car) => {
      if (car) {
        car.specifications.forEach((spec) => {
          spec.attributes.forEach((attr) => {
            if (!attributesMap[attr.name]) {
              attributesMap[attr.name] = {};
            }
            attributesMap[attr.name][car.id] = attr.value;
          });
        });
      }
    });

    const attributeNames = Object.keys(attributesMap);
    return (
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Thuộc tính</th>
            {iselectedCars.map((car, idx) => (
              <th key={idx}>{car ? car.name : ''}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {attributeNames.map((attribute) => (
            <tr key={attribute}>
              <td>{attribute}</td>
              {iselectedCars.map((car, idx) => (
                <td key={`${idx}-${attribute}`}>
                  {car ? attributesMap[attribute][car.id] || 'Không có dữ liệu' : 'Trống'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <section id="service" className="service-section" ref={ref}>
      <div className="service-container">
        <div className="service-header">
          <h2 className="service-title">So sánh xe</h2>
        </div>

        {/* Hiển thị các ô xe */}
        <div className="service-content">
          {iselectedCars.map((car, index) => (
            <div className="single-service-item" key={index}>
              {car ? (
                <>
                  <div className="service-image-container">
                    <img
                      src={car.thumbnail}
                      alt={car.name}
                      className="service-image"
                    />
                  </div>
                  <h3 className="service-name">{car.name}</h3>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      const updatedCars = [...iselectedCars];
                      updatedCars[index] = null; // Xóa xe khỏi vị trí
                      setSelectedCars(updatedCars);
                    }}
                  >
                    Xóa
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenSearch(index)}
                >
                  Thêm xe
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Nút So sánh */}
        <div className="service-footer">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowComparison(true)}
            disabled={iselectedCars.filter((car) => car).length < 2} // Chỉ cho phép nếu có ít nhất 2 xe
          >
            So sánh
          </Button>
        </div>

        {/* Dialog bảng so sánh */}
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

        {/* Dialog tìm kiếm */}
        <Dialog
          open={showSearch}
          onClose={() => setShowSearch(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Tìm kiếm xe</DialogTitle>
          <DialogContent>
            <TextField
              label="Tìm kiếm xe"
              variant="outlined"
              fullWidth
              onChange={handleSearch}
            />
            <div className="search-results">
              {filteredServices.map((car) => (
                <div
                  key={car.id}
                  style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                >
                  <img
                    src={car.thumbnail}
                    alt={car.name}
                    style={{ width: '50px', height: '50px', marginRight: '10px', borderRadius: '5px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div>{car.name}</div>
                    <div style={{ color: '#888' }}>{car.model}</div>
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddCarToComparison(car)}
                  >
                    Thêm
                  </Button>
                </div>
              ))}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSearch(false)} color="primary">
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </section>
  );
});

export default Services;
