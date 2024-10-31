package hdv_group11.CarSystem.domain.dtos.responses;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Builder
public record SpecificationResponseDTO(
        int id,
        String name,
        List<AttributeResponseDTO> attributes
) {}
