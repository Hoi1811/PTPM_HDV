package hdv_group11.CarSystem.domain.dtos;

import lombok.Builder;

@Builder
public record UpdateCarRequestDTO(
        String name,
        int yearManufacturer,
        String price
)
{}
