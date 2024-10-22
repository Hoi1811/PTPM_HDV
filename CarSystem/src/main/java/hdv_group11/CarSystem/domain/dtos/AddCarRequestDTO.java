package hdv_group11.CarSystem.domain.dtos;

import lombok.Builder;

@Builder
public record AddCarRequestDTO(
        String name,
        int yearManufacturer,
        String price
)
{}
