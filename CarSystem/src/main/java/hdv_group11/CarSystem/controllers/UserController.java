package hdv_group11.CarSystem.controllers;

import hdv_group11.CarSystem.domain.dtos.UserLoginDTO;
import hdv_group11.CarSystem.domain.dtos.UserRequestDTO;
import hdv_group11.CarSystem.domain.dtos.responses.UserLoginResponseDTO;
import hdv_group11.CarSystem.services.IUserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/users")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;


    @PostMapping("/register")
    public ResponseEntity<?> createUser(@Valid @RequestBody UserRequestDTO userRequestDTO, BindingResult result) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessage = result.getAllErrors().stream().map(ObjectError::getDefaultMessage).toList();
                return ResponseEntity.badRequest().body(errorMessage.toString());
            }
            if (!userRequestDTO.password().equalsIgnoreCase(userRequestDTO.retypePassword())) {
                return ResponseEntity.badRequest().body("Not match Password");
            }
            userService.createUser(userRequestDTO);
            return ResponseEntity.ok("Register ok!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponseDTO> login(@Valid @RequestBody UserLoginDTO userLoginDTO

    ) throws Exception {
        // kiem tra thong tin dang nhap va sinh token
        // kiem tra va tra ve token trong response
        try {
            String token = userService.login(userLoginDTO.phoneNumber(), userLoginDTO.password());
            UserLoginResponseDTO userLoginResponseDTO = new UserLoginResponseDTO("Login Success", token);
            return ResponseEntity.ok().body(userLoginResponseDTO);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new UserLoginResponseDTO("Login Fail", e.getMessage()));
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(@RequestParam String phoneNumber,
            HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization");
            userService.deleteByPhoneNumber(phoneNumber, token);
            return ResponseEntity.ok("Delete user success");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}


