package hdv_group11.CarSystem.domain.dtos.responses;

public record CarAttributeResponseDTO(
        int carID,
        int attributeId,
        String value
) {
}
