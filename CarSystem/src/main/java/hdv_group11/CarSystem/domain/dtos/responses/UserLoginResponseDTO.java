package hdv_group11.CarSystem.domain.dtos.responses;

import lombok.Builder;

@Builder
public record UserLoginResponseDTO(
        String message,
        String token,
        String role
) {
}
