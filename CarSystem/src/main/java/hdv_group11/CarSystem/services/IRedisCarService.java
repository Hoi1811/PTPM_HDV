package hdv_group11.CarSystem.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import hdv_group11.CarSystem.domain.dtos.responses.CarResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface IRedisCarService {
    void clear();
    void saveAllCars(
            Page<CarResponseDTO> carResponseDTOPage, String keyword, PageRequest pageRequest)  throws JsonProcessingException;
    Page<CarResponseDTO> getAllCars(String keyword, PageRequest pageRequest)  throws JsonProcessingException;
    Page<CarResponseDTO> getAllCars(PageRequest pageRequest)  throws JsonProcessingException;
    void saveAllCars(
            Page<CarResponseDTO> carResponseDTOPage, PageRequest pageRequest)  throws JsonProcessingException;
}
