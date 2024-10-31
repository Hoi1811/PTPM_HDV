package hdv_group11.CarSystem.domain.dtos.responses;

import lombok.Builder;

import java.util.List;
@Builder
public record CarListResponseDTO(
        List<CarResponseDTO> cars,
        int totalPage
)
{
}
