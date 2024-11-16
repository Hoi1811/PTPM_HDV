package hdv_group11.CarSystem.controllers;

import hdv_group11.CarSystem.domain.dtos.UpdateUserRequestDTO;
import hdv_group11.CarSystem.domain.dtos.UserLoginDTO;
import hdv_group11.CarSystem.domain.dtos.UserRequestDTO;
import hdv_group11.CarSystem.domain.dtos.responses.UserLoginResponseDTO;
import hdv_group11.CarSystem.domain.dtos.responses.UserResponseDTO;
import hdv_group11.CarSystem.domain.mapper.UserMapper;
import hdv_group11.CarSystem.domain.models.User;
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


    @GetMapping("getAllUsers")
    public ResponseEntity<?> getAllUsers(HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization");
            List<UserResponseDTO> userResponseDTOList = userService.getAllUsers(token);
            return ResponseEntity.ok().body(userResponseDTOList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("addUser")
    public ResponseEntity<?> addUser(@RequestBody UserRequestDTO userRequestDTO, HttpServletRequest request) throws Exception {
        String token = request.getHeader("Authorization");
        User user = userService.addUser(userRequestDTO,token);
        UserResponseDTO userResponseDTO = UserMapper.INSTANCE.toUserResponseDTO(user);
        if(user != null){
            return ResponseEntity.ok(userResponseDTO);
        }else {
            return ResponseEntity.badRequest().body("Loi");
        }
    }

    @PutMapping("updateUser")
    public ResponseEntity<?> updateUser(@RequestBody UpdateUserRequestDTO updateUserRequestDTO, HttpServletRequest request) throws Exception {
        String token = request.getHeader("Authorization");
        User user = userService.updateUser(updateUserRequestDTO,token);
        if(user != null){
            return ResponseEntity.ok(user);
        }else {
            return ResponseEntity.badRequest().body("Loi");
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


