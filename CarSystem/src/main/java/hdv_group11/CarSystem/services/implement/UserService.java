package hdv_group11.CarSystem.services.implement;


import hdv_group11.CarSystem.components.JwtTokenUtils;
import hdv_group11.CarSystem.domain.dtos.UserRequestDTO;
import hdv_group11.CarSystem.domain.mapper.UserMapper;
import hdv_group11.CarSystem.domain.models.Role;
import hdv_group11.CarSystem.domain.models.User;
import hdv_group11.CarSystem.repositories.RoleRepository;
import hdv_group11.CarSystem.repositories.UserRepository;
import hdv_group11.CarSystem.services.IUserService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtTokenUtils jwtTokenUtil;

    private final AuthenticationManager authenticationManager;

    @Override
    public User createUser(UserRequestDTO userRequestDTO) throws Exception {
        String phoneNumber = userRequestDTO.phoneNumber();
        if (userRepository.existsByPhoneNumber(phoneNumber)) {
            throw new DataIntegrityViolationException("Phone number already exists");
        }

        Role role = roleRepository.findById( userRequestDTO.roleId())
                .orElseThrow(() -> new Exception("Role not found"));
        if (role.getName().toUpperCase().equals(Role.ADMIN)) {
            throw new Exception("You cannot register admins");
        }

        // convert UserDTO => user
        User newUser = UserMapper.INSTANCE.toUser(userRequestDTO);

        if (userRequestDTO.facebookAccountId() == 0 && userRequestDTO.googleAccountId() == 0) {
            String password = userRequestDTO.password();
//            newUser.setPassword(password);
            newUser.setPassword(passwordEncoder.encode(password));
        }
        return userRepository.save(newUser);
    }

    @Override
    public String login(String phoneNumber, String password) throws Exception {
        Optional<User> optionalUser = userRepository.findByPhoneNumber(phoneNumber);
        if (optionalUser.isEmpty()) {
            throw new Exception("Invalid Username / Password");
        }
        //
        User user = optionalUser.get();
        // da co trong authenticationManager chiu trach nhiem
//        if(user.getFacebookAccountId() == 0 && user.getGoogleAccountId() == 0) {
//            if(passwordEncoder.matches(password, user.getPassword())){
//                throw new BadCredentialsException("Wrong phone number or password");
//            }
//        }
        // tao doi tuong de mang di so sanh
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                phoneNumber, password, user.getAuthorities()
        );
        // doi tuong được truyền vào authenticationManager -> authenticationProvider chịu trách nhiem
        // xac thuc
        authenticationManager.authenticate(authenticationToken);
        return jwtTokenUtil.generateToken(user);
    }

    @Override
    public void deleteByPhoneNumber(String phoneNumber, String token) throws Exception {
        Optional<User> optionalUser = userRepository.findByPhoneNumber(phoneNumber);
        if (optionalUser.isEmpty()) {
            throw new Exception("User not found");
        }
        // check role
        token = token.substring(7);
        final String userPhoneNumber = jwtTokenUtil.extractPhoneNumber(token);
        Optional<User> user = userRepository.findByPhoneNumber(userPhoneNumber);
        Role role = user.get().getRole();
        String subRole = optionalUser.get().getRole().getName().toUpperCase();
        if (!role.equals(Role.ADMIN)) {
            throw new Exception("Permission denied");
        }
        else if (role.equals(Role.ADMIN) && subRole.equals(Role.ADMIN)) {
            throw new Exception("You cannot delete admins");
        }
        else if(role.equals(Role.MODERATOR)){
            throw new Exception("You cannot delete users");
        }
        userRepository.deleteByPhoneNumber(phoneNumber);
    }

}

