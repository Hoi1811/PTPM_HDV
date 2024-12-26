import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần cần thiết cho biểu đồ cột
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CarStatistics = () => {
    const [carViews, setCarViews] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Lượt xem xe',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.5)', // Màu cột
                borderColor: 'rgba(75, 192, 192, 1)', // Viền cột
                borderWidth: 1,
            },
        ],
    });

    const fetchCarViews = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:8088/api/v1/car/top', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch car data');
            }

            const data = await response.json();
            setCarViews(data);
        } catch (error) {
            console.error('Error fetching car data:', error);
        }
    };

    useEffect(() => {
        fetchCarViews();
    }, []);

    useEffect(() => {
        if (carViews.length > 0) {
            setChartData({
                labels: carViews.map((item) => item.car.name), // Lấy tên xe
                datasets: [
                    {
                        label: 'Lượt xem xe',
                        data: carViews.map((item) => item.viewCount), // Lấy số lượt xem
                        backgroundColor: carViews.map(() => 'rgba(75, 192, 192, 0.5)'), // Tạo màu cột đồng nhất
                        borderColor: carViews.map(() => 'rgba(75, 192, 192, 1)'), // Viền cột
                        borderWidth: 1,
                    },
                ],
            });
        }
    }, [carViews]);

    return (
        <div style={{ marginLeft: '-120px' }}>
            <h2>Biểu đồ lượt xem xe</h2>
            <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', marginLeft: '100px' }}>
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                display: true, // Hiển thị chú thích
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Thống kê lượt xem xe trong tuần',
                                font: {
                                    size: 16,
                                },
                            },
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Tên xe',
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Số lượt xem',
                                },
                                beginAtZero: true, // Bắt đầu từ 0
                                max: 200, // Đặt giới hạn cao nhất là 200
                                ticks: {
                                    stepSize: 10, // Khoảng cách giữa các giá trị
                                },
                            },
                        },
                    }}
                />
            </div>

            <h5 style={{ marginTop: '20px', color: 'black' }}>Danh sách lượt xem nhiều nhất</h5>
            <ul>
                {carViews
                    .sort((a, b) => b.viewCount - a.viewCount) // Sắp xếp theo viewCount
                    .map((item, index) => (
                        <li
                            key={index}
                            style={{
                                padding: '8px 12px',
                                borderBottom: '1px solid #ddd',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '14px',
                                color: 'black',
                                backgroundColor: '#fff',
                                borderRadius: '3px',
                                marginBottom: '4px',
                                boxShadow: 'none',
                                maxWidth: '600px',
                                width: '100%',
                                marginLeft: '200px',
                                marginRight: 'auto',
                            }}
                        >
                            <strong style={{ fontWeight: '600', color: '#333' }}>{item.car.name}</strong>
                            <span style={{ fontSize: '12px', color: '#888' }}>{item.viewCount} lượt xem</span>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default CarStatistics;
