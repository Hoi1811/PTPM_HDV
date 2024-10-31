package hdv_group11.CarSystem.domain.dtos;

import java.util.List;

public record SpecificationRequestDTO(
        int id,
        String name,
        List<AttributeRequestDTO> attributes
) {}
