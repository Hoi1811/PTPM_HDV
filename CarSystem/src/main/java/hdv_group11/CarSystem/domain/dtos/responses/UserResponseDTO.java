package hdv_group11.CarSystem.domain.dtos.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import hdv_group11.CarSystem.domain.models.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.sql.Date;

public record UserResponseDTO(
        @JsonProperty("fullname")
        String fullName,

        @JsonProperty("phone_number")
        String phoneNumber,

        String address,

        @JsonProperty("date_of_birth")
        Date dateOfBirth,

        @JsonProperty("is_active")
        boolean active,

        @JsonProperty("facebook_account_id")
        int facebookAccountId,

        @JsonProperty("google_account_id")
        int googleAccountId,

        @JsonProperty
        Role role
) {
}
