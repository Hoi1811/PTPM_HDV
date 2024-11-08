package hdv_group11.CarSystem.domain.dtos;

import lombok.Builder;

import java.util.List;

@Builder
public record UpdateCarRequestDTO(
        int id,
        String name,
        int yearManufacturer,
        String model,
        String price,
        List<SpecificationRequestDTO> specifications
)
{}
