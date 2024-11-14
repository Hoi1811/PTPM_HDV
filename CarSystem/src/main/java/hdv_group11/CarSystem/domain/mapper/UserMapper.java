package hdv_group11.CarSystem.domain.mapper;

import hdv_group11.CarSystem.domain.dtos.UserRequestDTO;
import hdv_group11.CarSystem.domain.dtos.responses.UserResponseDTO;
import hdv_group11.CarSystem.domain.models.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.mapstruct.factory.Mappers;
@Mapper
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);
    @Mappings({
            @Mapping(target = "role.id", source = "roleId")
    })
    User toUser(UserRequestDTO userRequestDTO);

    UserResponseDTO toUserResponseDTO(User user);
}
