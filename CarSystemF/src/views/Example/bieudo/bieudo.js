import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2'; // Sử dụng biểu đồ Line của Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần của Chart.js để sử dụng
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CarStatistics = () => {
    // Dữ liệu giả định về số lượt xem các xe trong tuần
    const [carViews, setCarViews] = useState([
        { name: 'VinFast VF 8 plus', views: 20 },
        { name: 'VinFast VF 8s', views: 35 },
        { name: 'VinFast VF 9 - Eco', views: 45 },
        { name: 'Toyota Wigo - E', views: 60 },
        { name: 'Lexus ES - 250', views: 55 },
    ]);

    // Dữ liệu biểu đồ về số lượt xem xe theo ngày trong tuần
    const [chartData, setChartData] = useState({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Lượt xem xe',
                data: [30, 50, 20, 70, 60, 90, 80],
                borderColor: '#04AA6D',
                backgroundColor: 'rgba(4, 170, 109, 0.2)',
                fill: true,
            },
        ],
    });

    // Tạo một hàm giả lập việc cập nhật số lượt xem xe (ví dụ: từ API)
    useEffect(() => {
        const interval = setInterval(() => {
            // Cập nhật số lượt xem của từng xe
            setCarViews((prevViews) => {
                return prevViews.map((car) => ({
                    ...car,
                    views: car.views + Math.floor(Math.random() * 10), // Thêm ngẫu nhiên một số lượt xem
                }));
            });
        }, 5000); // Cập nhật sau mỗi 5 giây (giả lập)

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ marginLeft: '-120px' }}>
            <h2>Biểu đồ xem xe </h2>
            <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', marginLeft: '100px' }}>
                <Line data={chartData} options={{ responsive: true }} />
            </div>


            <h5 style={{ marginTop: '20px', color: 'black' }}>Danh sách lượt xem nhiều nhất</h5>
            <ul>
                {carViews
                    .sort((a, b) => b.views - a.views) // Sắp xếp danh sách xe theo lượt xem giảm dần
                    .map((car, index) => (
                        <li key={index} style={{
                            padding: '8px 12px', // Giảm padding để sát mép hơn
                            borderBottom: '1px solid #ddd', // Đảm bảo viền mỏng và rõ ràng
                            display: 'flex', // Sử dụng Flexbox để căn chỉnh các phần tử ngang
                            justifyContent: 'space-between', // Tách biệt tên xe và lượt xem
                            alignItems: 'center', // Căn giữa phần tử theo chiều dọc
                            fontSize: '14px', // Điều chỉnh font-size nhỏ hơn để không chiếm nhiều không gian
                            color: 'black', // Màu chữ tối
                            backgroundColor: '#fff', // Màu nền trắng để tạo độ tương phản
                            borderRadius: '3px', // Bo góc nhẹ
                            marginBottom: '4px', // Giảm khoảng cách giữa các mục
                            boxShadow: 'none', // Bỏ bóng đổ để làm phần tử mượt mà hơn
                            maxWidth: '600px', // Giới hạn chiều ngang tối đa của mục (có thể điều chỉnh)
                            width: '100%', // Chiều rộng 100% để phần tử chiếm toàn bộ chiều rộng của container cha
                            marginLeft: '200px', // Căn giữa theo chiều ngang
                            marginRight: 'auto', // Căn giữa theo chiều ngang
                        }}>
                            <strong style={{ fontWeight: '600', color: '#333' }}>{car.name}</strong>
                            <span style={{ fontSize: '12px', color: '#888' }}>{car.views} lượt xem</span>
                        </li>



                    ))}
            </ul>
        </div>
    );
};

export default CarStatistics;
