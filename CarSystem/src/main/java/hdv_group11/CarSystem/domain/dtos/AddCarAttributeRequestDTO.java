package hdv_group11.CarSystem.domain.dtos;

public record AddCarAttributeRequestDTO(
        int carId,
        int attributeId,
        String value
) {
}
