package hdv_group11.CarSystem.controllers;

import hdv_group11.CarSystem.domain.models.EmailDetails;
import hdv_group11.CarSystem.services.IEmailService;
import hdv_group11.CarSystem.services.implement.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.prefix}/email")
@RequiredArgsConstructor
public class EmailController {
    private final IEmailService iEmailService;

    @GetMapping("/send")
    public ResponseEntity<?> sendEmail(@RequestParam String recipientEmail, @RequestParam String userName) throws Exception {
        iEmailService.sendEmailWithAttachment(recipientEmail, userName);
        return ResponseEntity.ok("Email sent successfully");
    }
}
