package hdv_group11.CarSystem.services;

import hdv_group11.CarSystem.domain.dtos.AddCarDetailsRequestDTO;
import hdv_group11.CarSystem.domain.dtos.AddCarRequestDTO;
import hdv_group11.CarSystem.domain.dtos.UpdateCarRequestDTO;
import hdv_group11.CarSystem.domain.dtos.responses.CarDetailResponseDTO;
import hdv_group11.CarSystem.domain.dtos.responses.CarResponseDTO;
import hdv_group11.CarSystem.domain.models.Car;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface ICarService {
    CarResponseDTO getCar(int id);
    Page<CarResponseDTO> getAllCars(PageRequest pageRequest);
    CarDetailResponseDTO getCarDetail(int id);
    List<CarDetailResponseDTO> getCarDetailList(List<Integer> ids);
    Car createCar(AddCarRequestDTO addCarRequestDTO);
    Car createCarDetail(AddCarDetailsRequestDTO addCarDetailsRequestDTO);
    Car updateCar(UpdateCarRequestDTO updateCarRequestDTO);
    void deleteCar(int id);
}