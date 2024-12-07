import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TopCarChart = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  // Token giả lập
  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJwaG9uZU51bWJlciI6ImFiYzEyMyFAIyIsInN1YiI6ImFiYzEyMyFAIyIsImV4cCI6MTczNDM1ODY0M30.Xx4ovaVcacu_6sfePLCWjIvOIwOfkOmTSDtpW6tBUoc';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8088/api/v1/car/top', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Gán dữ liệu biểu đồ từ API
        const limitedData = data.slice(0, 5); // Lấy 5 xe đầu tiên

        const labels = limitedData.map(item => item.car.name);
        const views = limitedData.map(item => item.viewCount);
        const images = limitedData.map(item => item.car.thumbnail);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Lượt xem',
              data: views,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
          images: images, // Thêm hình ảnh vào chartData
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!chartData) {
    return <p>Đang tải biểu đồ...</p>;
  }

  // Plugin tuỳ chỉnh để hiển thị hình ảnh bên cạnh cột
  const imagePlugin = {
    id: 'imagePlugin',
    afterDraw(chart) {
      const { ctx, chartArea: { left, top }, scales: { y } } = chart;

      chartData.images.forEach((imageSrc, index) => {
        const image = new Image();
        image.src = imageSrc;
        const yPosition = y.getPixelForValue(index); // Lấy vị trí y của từng cột

        ctx.drawImage(image, left - 50, yPosition - 15, 30, 30); // Vẽ hình ảnh bên trái cột
      });
    },
  };

  return (
    <div id="topCar" style={{ width: '80%', margin: '0 auto', padding: '20px' }}>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          indexAxis: 'y', // Hiển thị biểu đồ ngang
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Top 5 Xe Có Lượt Xem Nhiều Nhất',
            },
          },
          scales: {
            x: {
              beginAtZero: true,
            },
          },
        }}
        plugins={[imagePlugin]} // Thêm plugin hiển thị hình ảnh
      />
    </div>
  );
};

export default TopCarChart;
