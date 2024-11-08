package hdv_group11.CarSystem.domain.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record AddCarImageRequestDTO(
        @JsonProperty("car_id")
        @Min(value = 1, message = "Product'id must be > 0")
        int carId,
        @Size(min = 5, max = 200, message = "Image's name")
        @JsonProperty("image_url")
        String imageURL
) {
}
