package hdv_group11.CarSystem.domain.dtos;

import java.util.List;

public record AddCarDetailsRequestDTO(
        AddCarRequestDTO car,
        List<SpecificationRequestDTO> specifications
)
{
}
