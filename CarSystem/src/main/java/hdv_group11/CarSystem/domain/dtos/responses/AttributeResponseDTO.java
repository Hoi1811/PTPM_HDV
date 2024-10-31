package hdv_group11.CarSystem.domain.dtos.responses;

import lombok.Builder;

@Builder
public record AttributeResponseDTO(
        int id,
        int specificationId,
        String name,
        String value
) {}
