package hdv_group11.CarSystem.domain.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.Date;

public record UpdateUserRequestDTO(
        @JsonProperty("fullname")
        String fullName,

        @JsonProperty("phone_number")
        String phoneNumber,

        String address,

        String password,

        @JsonProperty("retype_password")
        String retypePassword,

        @JsonProperty("date_of_birth")
        Date dateOfBirth,


        @JsonProperty("role_id")
        int roleId
) {
}
