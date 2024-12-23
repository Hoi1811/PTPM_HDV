package hdv_group11.CarSystem.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import hdv_group11.CarSystem.domain.dtos.responses.CarResponseDTO;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface IRedisCarService {
    void clear();
    void saveAllCars(
            List<CarResponseDTO> carResponseDTOS, String keyword, PageRequest pageRequest)  throws JsonProcessingException;
    List<CarResponseDTO> getAllCars(String keyword, PageRequest pageRequest)  throws JsonProcessingException;
}
