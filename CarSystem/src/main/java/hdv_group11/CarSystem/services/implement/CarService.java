package hdv_group11.CarSystem.services.implement;

import hdv_group11.CarSystem.domain.dtos.*;
import hdv_group11.CarSystem.domain.dtos.responses.*;
import hdv_group11.CarSystem.domain.mapper.CarMapper;
import hdv_group11.CarSystem.domain.models.Attribute;
import hdv_group11.CarSystem.domain.models.Car;
import hdv_group11.CarSystem.domain.models.CarAttribute;
import hdv_group11.CarSystem.domain.models.Specification;
import hdv_group11.CarSystem.repositories.AttributeRepository;
import hdv_group11.CarSystem.repositories.CarAttributeRepository;
import hdv_group11.CarSystem.repositories.CarRepository;
import hdv_group11.CarSystem.repositories.SpecificationRepository;
import hdv_group11.CarSystem.services.ICarService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CarService implements ICarService {
    private final CarRepository carRepository;
    private final SpecificationRepository specificationRepository;
    private final AttributeRepository attributeRepository;
    private final CarAttributeRepository carAttributeRepository;
    @Override
    public CarResponseDTO getCar(int id) {
        return null;
    }

    @Override
    public Page<CarResponseDTO> getAllCars(PageRequest pageRequest) {
        return carRepository.findAll(pageRequest).map(CarMapper.INSTANCE::toCarResponseDTO);
    }

    @Override
    public CarDetailResponseDTO getCarDetail(int id) {
        Car car = carRepository.findById(id).orElseThrow(() -> new RuntimeException("Car not found"));
        List<Specification> specifications = specificationRepository.findAll();

        List<CarAttribute> carAttributes = carAttributeRepository.findAllByCarId(id);

        List<AttributeResponseDTO> attributeResponseDTOS = carAttributes.stream()
                .map(CarMapper.INSTANCE::toAttributeResponseDTO)
                .collect(Collectors.toList());

        List<SpecificationResponseDTO> specificationResponseDTOS = specifications.stream()
                .map(specification -> {
                    // Lọc ra các attributeResponseDTO có specificationId khớp với specification hiện tại
                    List<AttributeResponseDTO> matchingAttributes = attributeResponseDTOS.stream()
                            .filter(attributeResponseDTO -> attributeResponseDTO.specificationId() == specification.getId())
                            .collect(Collectors.toList());

                    // Sử dụng constructor của record để truyền danh sách matchingAttributes khi tạo SpecificationResponseDTO
                    return new SpecificationResponseDTO(
                            specification.getId(),
                            specification.getName(),
                            matchingAttributes // Truyền danh sách attributes tương ứng vào record
                    );
                })
                .collect(Collectors.toList());
        CarDetailResponseDTO carDetailResponseDTO = CarMapper.INSTANCE.toCarDetailResponseDTO(car, specificationResponseDTOS);
        return carDetailResponseDTO;
    }

    @Override
    public List<CarDetailResponseDTO> getCarDetailList(List<Integer> ids) {
        List<CarDetailResponseDTO> carDetailResponseDTOS = ids.stream()
                .map(this::getCarDetail)
                .collect(Collectors.toList());
        return carDetailResponseDTOS;
    }

    @Override
    public Car createCar(AddCarRequestDTO addCarRequestDTO) {
            if(carRepository.findByName(
                    addCarRequestDTO.name()).isPresent()
                    && carRepository.findByModel(addCarRequestDTO.model()).isPresent()){
                throw new RuntimeException("Car already exists");
            }
            Car car = CarMapper.INSTANCE.toCar(addCarRequestDTO);
            return carRepository.save(car);
    }

    @Override
    public Car createCarDetail(AddCarDetailsRequestDTO addCarDetailsRequestDTO) {
        Car car = CarMapper.INSTANCE.toCar(addCarDetailsRequestDTO);
        if(carRepository.findByName(
                car.getName()).isPresent()
                && carRepository.findByModel(car.getModel()).isPresent()){
            throw new RuntimeException("Car already exists");
        }
        List<SpecificationRequestDTO> specificationRequestDTOS = addCarDetailsRequestDTO.specifications();
        specificationRequestDTOS.stream()
                .map(specificationRequestDTO -> {
                    Specification specification = CarMapper.INSTANCE.toSpecification(specificationRequestDTO);

                    List<AttributeRequestDTO> attributeRequestDTOS = specificationRequestDTO.attributes();

                    List<CarAttribute> carAttributes = attributeRequestDTOS.stream()
                            .map(attributeRequestDTO -> {
                                Attribute attribute = CarMapper.INSTANCE.toAttribute(attributeRequestDTO);
                                CarAttribute carAttribute = CarAttribute.builder()
                                        .car(car)
                                        .attribute(attribute)
                                        .value(attributeRequestDTO.value())
                                        .build();
                                return carAttribute;
                            })
                            .collect(Collectors.toList());
                    carAttributeRepository.saveAll(carAttributes);
                    return specification;
                })
                .collect(Collectors.toList());
        return car;
    }


    @Override
    public Car updateCar(UpdateCarRequestDTO updateCarRequestDTO) {
        return null;
    }

    @Override
    public void deleteCar(int id) {

    }
}
