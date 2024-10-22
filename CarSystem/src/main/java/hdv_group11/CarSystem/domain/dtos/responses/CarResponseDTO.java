package hdv_group11.CarSystem.domain.dtos.responses;

public record CarResponseDTO(
        int id,
        String name,
        int yearManufacturer,
        String price
) {
}
