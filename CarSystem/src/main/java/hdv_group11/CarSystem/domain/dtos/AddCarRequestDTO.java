package hdv_group11.CarSystem.domain.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.NonNull;

@Builder
public record AddCarRequestDTO(
        String name,

        @NonNull
        @JsonProperty("year_manufacture")
        int yearManufacture,

        String model,
        String price,
        ManufacturerRequestDTO manufacturer
)
{}
