// import React from "react";
// import './Nav.scss';
// import { Link } from "react-router-dom";

// const Nav = () => {
//     return (
//         <div className="topnav">
//             <Link to="/admin/a" className={({ isActive }) => (isActive ? "active" : "")}>Trang chủ</Link>
//             <Link to="/admin/user" className={({ isActive }) => (isActive ? "active" : "")}>Người dùng</Link>
//             <Link to="/admin/Todos" className={({ isActive }) => (isActive ? "active" : "")}>Ô tô</Link>
//             <Link to="/admin/document" className={({ isActive }) => (isActive ? "active" : "")}>Tài liệu thêm</Link>
//             <Link to="/out" className={({ isActive }) => (isActive ? "active" : "")}>Trang cá nhân</Link>
//             {/* <Link to="/admin/carlist" className={({ isActive }) => (isActive ? "active" : "")}>carlist</Link> */}
//             {/* <Link to="/admin/cardetail/:id" className={({ isActive }) => (isActive ? "active" : "")}>cardetail</Link>
//             <button>djdjd</button> */}
//         </div>
//     );
// };

// export default Nav;


import React, { useState } from "react";
import './Nav.scss';
import { Link, useLocation } from "react-router-dom";

const Nav = () => {
    const [activeLink, setActiveLink] = useState(null);
    const location = useLocation(); // Dùng để lấy đường dẫn hiện tại

    // Cập nhật trạng thái active khi click vào một liên kết
    const handleLinkClick = (path) => {
        setActiveLink(path);
    };

    return (
        <div className="topnav">
            <Link
                to="/admin/a"
                className={activeLink === "/admin/a" ? "active" : ""}
                onClick={() => handleLinkClick("/admin/a")}
            >
                Trang chủ
            </Link>
            <Link
                to="/admin/user"
                className={activeLink === "/admin/user" ? "active" : ""}
                onClick={() => handleLinkClick("/admin/user")}
            >
                Người dùng
            </Link>
            <Link
                to="/admin/Todos"
                className={activeLink === "/admin/Todos" ? "active" : ""}
                onClick={() => handleLinkClick("/admin/Todos")}
            >
                Ô tô
            </Link>
            <Link
                to="/admin/document"
                className={activeLink === "/admin/document" ? "active" : ""}
                onClick={() => handleLinkClick("/admin/document")}
            >
                Tài liệu thêm
            </Link>
            <Link
                to="/out"
                className={activeLink === "/out" ? "active" : ""}
                onClick={() => handleLinkClick("/out")}
            >
                Trang cá nhân
            </Link>
        </div>
    );
};

export default Nav;
