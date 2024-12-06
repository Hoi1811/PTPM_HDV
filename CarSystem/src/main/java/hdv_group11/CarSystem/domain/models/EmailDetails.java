package hdv_group11.CarSystem.domain.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class EmailDetails {
        private String sender;         // Địa chỉ email của người gửi
        private String recipient;      // Địa chỉ email của người nhận
        private String subject;        // Tiêu đề của email
        private String msgBody;        // Nội dung email (với văn bản thuần túy)
        private String htmlBody;       // Nội dung email (với HTML)
        private String attachment;     // Đường dẫn tệp đính kèm (nếu có)
}
