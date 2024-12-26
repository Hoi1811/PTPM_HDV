import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, user, requiredRole }) => {
  if (!user || !user.isLoggedIn) {
    // Nếu chưa đăng nhập, chuyển hướng tới trang đăng nhập
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Nếu không có quyền, chuyển hướng tới trang không đủ quyền
    return <Navigate to="/not-authorized" replace />;
  }

  // Nếu hợp lệ, hiển thị component được bảo vệ
  return element;
};

export default ProtectedRoute;
