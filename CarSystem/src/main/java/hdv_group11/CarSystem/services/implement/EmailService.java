package hdv_group11.CarSystem.services.implement;

import hdv_group11.CarSystem.configurations.AsyncConfig;
import hdv_group11.CarSystem.domain.models.EmailDetails;
import hdv_group11.CarSystem.services.IEmailService;
import jakarta.annotation.PreDestroy;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.concurrent.*;

@Service
@RequiredArgsConstructor
public class EmailService implements IEmailService {

    private final JavaMailSender javaMailSender;

    private final TemplateEngine templateEngine;
    @Value("${spring.mail.username}")
    private String from;

    @Async
    @Override
    public void sendEmailWithAttachment(String recipientEmail, String userName) throws MessagingException {
                MimeMessage mimeMessage = javaMailSender.createMimeMessage();
                MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
                mimeMessageHelper.setFrom(from);
                mimeMessageHelper.setTo(recipientEmail);
                mimeMessageHelper.setSubject("Welcome to our system");
                mimeMessageHelper.setText(generateWelcomeEmailContent(userName), true);
                javaMailSender.send(mimeMessage);
    }

    private String generateWelcomeEmailContent(String userName){
        Context context = new Context();
        context.setVariable("userName", userName);
        return templateEngine.process("welcomeTemplate", context);
    }

}
