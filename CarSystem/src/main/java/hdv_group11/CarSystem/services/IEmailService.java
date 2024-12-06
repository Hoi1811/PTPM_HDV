package hdv_group11.CarSystem.services;

import hdv_group11.CarSystem.domain.models.EmailDetails;
import jakarta.mail.MessagingException;

public interface IEmailService {

    void sendEmailWithAttachment(String recipientEmail,  String userName) throws MessagingException;
}
