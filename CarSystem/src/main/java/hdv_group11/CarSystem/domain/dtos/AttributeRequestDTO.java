package hdv_group11.CarSystem.domain.dtos;

public record AttributeRequestDTO(
        int id,
        int specificationId,
        String name,
        String value
) {
}
