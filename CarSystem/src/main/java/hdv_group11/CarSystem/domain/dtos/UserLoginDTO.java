package hdv_group11.CarSystem.domain.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UserLoginDTO(
        @JsonProperty("phone_number")
        String phoneNumber,
        @JsonProperty("password")
        String password
) {
}
