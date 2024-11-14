package hdv_group11.CarSystem.services;

import hdv_group11.CarSystem.domain.dtos.UserRequestDTO;
import hdv_group11.CarSystem.domain.models.User;

public interface IUserService {
    User createUser(UserRequestDTO userRequestDTO) throws Exception;

    String login(String phoneNumber, String password) throws Exception;

    void deleteByPhoneNumber(String phoneNumber, String token) throws Exception;


}
