import React, { useState } from "react";
import './Document.scss';  // Đảm bảo bạn đã có file này để thiết kế

const Document = () => {
    // Dữ liệu giả lập về tài liệu hướng dẫn
    const documents = [
        {
            id: 1,
            title: "Hướng dẫn sử dụng hệ thống quản trị",
            description: "Chi tiết hướng dẫn sử dụng các chức năng cơ bản của hệ thống.",
            category: "Hướng dẫn sử dụng",
            content: <span>"1. Trang Quản Lý Ô Tô"
                "Trang này cho phép quản trị viên quản lý danh sách ô tô với các chức năng chính sau:

                1.1 Thêm Ô Tô Mới
                Truy cập vào phần Danh Sách Ô Tô trên thanh điều hướng(Nav).
                Tìm nút Thêm Ô Tô hoặc Add Car.
                Điền thông tin ô tô mới, bao gồm các trường như:
                Tên ô tô(VD: Toyota Corolla, Honda Civic)
                Loại xe(Sedan, SUV, Hatchback, v.v.)
                Giá hoặc Giá Thuê(nếu có)
                Tình trạng xe(Có sẵn, Bảo trì, Đã bán, v.v.)
                Nhấn Lưu hoặc Save để thêm ô tô vào danh sách.
                1.2 Chỉnh Sửa Thông Tin Ô Tô
                Trong danh sách ô tô, tìm ô tô bạn muốn chỉnh sửa.
                Bên cạnh ô tô đó sẽ có nút Sửa hoặc Edit.
                Nhấp vào Sửa để mở giao diện chỉnh sửa.
                Thay đổi thông tin cần thiết(tên, loại xe, giá, tình trạng).
                Nhấn Cập Nhật hoặc Update để lưu thay đổi.
                1.3 Xóa Ô Tô
                Trong danh sách ô tô, tìm ô tô bạn muốn xóa.
                Bên cạnh ô tô đó sẽ có nút Xóa hoặc Delete.
                Nhấp vào Xóa và xác nhận yêu cầu xóa.
                Ô tô sẽ bị xóa khỏi danh sách sau khi xác nhận.
                2. Trang Quản Lý Người Dùng
                Trang này cho phép quản trị viên quản lý danh sách người dùng với các chức năng sau:

                2.1 Sửa Thông Tin Người Dùng
                Truy cập vào phần Danh Sách Người Dùng trên thanh điều hướng.
                Tìm người dùng mà bạn muốn chỉnh sửa trong danh sách.
                Bên cạnh người dùng đó sẽ có nút Sửa hoặc Edit.
                Nhấp vào Sửa để mở giao diện chỉnh sửa người dùng.
                Thay đổi các thông tin cần thiết của người dùng(tên, email, quyền hạn, v.v.).
                Nhấn Cập Nhật hoặc Update để lưu lại thay đổi.
                2.2 Xóa Người Dùng
                Trong danh sách người dùng, tìm người dùng bạn muốn xóa.
                Bên cạnh người dùng đó sẽ có nút Xóa hoặc Delete.
                Nhấp vào Xóa và xác nhận yêu cầu xóa.
                Người dùng sẽ bị xóa khỏi hệ thống sau khi xác nhận.
                Lưu Ý
                Xác Nhận Xóa: Mỗi khi nhấn nút xóa, hệ thống sẽ hiển thị một hộp thoại xác nhận để tránh xóa nhầm.
                Quản Lý Quyền Truy Cập: Một số thao tác có thể yêu cầu quyền truy cập của quản trị viên hoặc người có quyền chỉnh sửa.
                Lời Khuyên Sử Dụng
                Thêm Mới: Kiểm tra kỹ thông tin trước khi nhấn Lưu để đảm bảo dữ liệu chính xác.
                Xóa: Hãy chắc chắn rằng bạn muốn xóa thông tin vì hành động này không thể hoàn tác.
                ",</span>
        },
        {
            id: 2,
            title: "Cập nhật thông tin ô tô",
            description: "Hướng dẫn chi tiết cách cập nhật thông tin ô tô trong hệ thống.",
            category: "Quản lý ô tô",
            content: "Để cập nhật thông tin ô tô, bạn cần truy cập vào mục 'Quản lý ô tô' và thực hiện các thao tác sửa thông tin cần thiết...",
        },
        {
            id: 3,
            title: "Câu hỏi thường gặp (FAQ)",
            description: "Những câu hỏi thường gặp trong việc sử dụng hệ thống.",
            category: "Câu hỏi thường gặp",
            content: "Trong phần này, bạn sẽ tìm thấy những câu hỏi phổ biến về việc sử dụng hệ thống, các lỗi thường gặp và cách giải quyết...",
        },
        {
            id: 4,
            title: "Hướng dẫn bảo trì hệ thống",
            description: "Hướng dẫn các thao tác bảo trì định kỳ cho hệ thống.",
            category: "Bảo trì hệ thống",
            content: "Để đảm bảo hệ thống hoạt động hiệu quả, bạn cần thực hiện các công việc bảo trì định kỳ, như sao lưu dữ liệu, cập nhật phần mềm...",
        },
    ];

    // State lưu trữ các tài liệu, tài liệu đang chọn, và từ khóa tìm kiếm
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("Tất cả");

    // Hàm tìm kiếm tài liệu
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    // Hàm lọc theo danh mục tài liệu
    const handleCategoryFilter = (category) => {
        setCategoryFilter(category);
    };

    // Lọc tài liệu theo từ khóa tìm kiếm và danh mục
    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || doc.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "Tất cả" || doc.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="document-container">
            <div className="document-header">
                <h2>Tài liệu tham khảo</h2>
                <p>Hướng dẫn và tài liệu liên quan đến hệ thống quản trị.</p>
            </div>

            {/* Tìm kiếm tài liệu */}
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Tìm kiếm tài liệu..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            {/* Lọc theo danh mục */}
            <div className="category-filter">
                <button onClick={() => handleCategoryFilter("Tất cả")}>Tất cả</button>
                <button onClick={() => handleCategoryFilter("Hướng dẫn sử dụng")}>Hướng dẫn sử dụng</button>
                <button onClick={() => handleCategoryFilter("Quản lý ô tô")}>Quản lý ô tô</button>
                <button onClick={() => handleCategoryFilter("Câu hỏi thường gặp")}>Câu hỏi thường gặp</button>
                <button onClick={() => handleCategoryFilter("Bảo trì hệ thống")}>Bảo trì hệ thống</button>
            </div>

            {/* Danh sách tài liệu */}
            <div className="document-list">
                {filteredDocuments.length === 0 ? (
                    <p>Không có tài liệu nào phù hợp với tìm kiếm của bạn.</p>
                ) : (
                    filteredDocuments.map(doc => (
                        <div className="document-item" key={doc.id}>
                            <h4 onClick={() => setSelectedDoc(doc)}>{doc.title}</h4>
                            <p>{doc.description}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Hiển thị chi tiết tài liệu khi chọn */}
            {selectedDoc && (
                <div className="document-detail">
                    <h3>{selectedDoc.title}</h3>
                    <p>{selectedDoc.content}</p>
                    <button onClick={() => setSelectedDoc(null)}>Đóng</button>
                </div>
            )}
        </div>
    );
};

export default Document;
