package hdv_group11.CarSystem.domain.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.sql.Date;

public record UserRequestDTO(
        @JsonProperty("fullname")
        String fullName,

        @JsonProperty("phone_number")
        @NotBlank(message = "Phone number is required")
        String phoneNumber,

        String address,

        @NotBlank(message = "password can't blank")
        String password,

        @JsonProperty("retype_password")
        String retypePassword,

        @JsonProperty("date_of_birth")
        Date dateOfBirth,

        @JsonProperty("facebook_account_id")
        int facebookAccountId,

        @JsonProperty("google_account_id")
        int googleAccountId,

        @NotNull(message = "Role is required")
        @JsonProperty("role_id")
        Long roleId
) {
}
