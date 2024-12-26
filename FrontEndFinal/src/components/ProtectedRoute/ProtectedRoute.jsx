import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, user, requiredRole }) => {
  // Kiểm tra nếu user chưa đăng nhập hoặc không có role đúng
  const authToken = localStorage.getItem('authToken'); // Lấy token từ localStorage
  if (!authToken) {
    // Nếu không có authToken thì chuyển hướng đến trang đăng nhập
    return <Navigate to="/login" />;
  }

  if (user.role !== requiredRole) {
    // Nếu user không có role phù hợp, chuyển hướng đến trang không có quyền truy cập
    return <Navigate to="/not-authorized" />;
  }

  // Nếu tất cả đều hợp lệ, cho phép truy cập vào route bảo vệ
  return element;
};

export default ProtectedRoute;
