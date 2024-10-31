package hdv_group11.CarSystem.domain.dtos.responses;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CarResponseDTO(
        int id,
        String name,
        @JsonProperty("year_manufacture")
        int yearManufacture,
        String model,
        String price
) {}
