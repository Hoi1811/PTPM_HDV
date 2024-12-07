import React from "react";

// Hàm để tạo màu ngẫu nhiên
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// HOC (Higher-Order Component) để thay đổi màu sắc ngẫu nhiên cho component
const Color = (WrappedComponent) => {
    const colorRandom = getRandomColor(); // Tạo màu ngẫu nhiên
    return (props) => {
        return (
            <div style={{ color: colorRandom }}>
                <WrappedComponent {...props} /> {/* Render component con với màu ngẫu nhiên */}
            </div>
        );
    };
}
//boc code nhieu
export default Color;

