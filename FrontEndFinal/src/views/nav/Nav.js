import React, { useState } from "react";
import "./Nav.scss";
import { Link } from "react-router-dom";

const Nav = () => {
    const [activeLink, setActiveLink] = useState("/admin/a");

    // Cập nhật trạng thái active khi click
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
                Bảng điều khiển
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
