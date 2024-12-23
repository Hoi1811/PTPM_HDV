package hdv_group11.CarSystem.services.implement;

import hdv_group11.CarSystem.domain.dtos.*;
import hdv_group11.CarSystem.domain.dtos.responses.*;
import hdv_group11.CarSystem.domain.mapper.CarMapper;
import hdv_group11.CarSystem.domain.models.*;
import hdv_group11.CarSystem.repositories.*;
import hdv_group11.CarSystem.services.ICarService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CarService implements ICarService {
    private final CarRepository carRepository;
    private final SpecificationRepository specificationRepository;
    private final AttributeRepository attributeRepository;
    private final CarAttributeRepository carAttributeRepository;
    private final CarImageRepository carImageRepository;
    private final ManufacturerRepository manufacturerRepository;
    private final CarViewRepository carViewRepository;
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
                    && carRepository.findByModel(addCarRequestDTO.model()).isPresent()
            ){
                throw new RuntimeException("Car already exists");
            }
            Optional<Manufacturer> optionalManufacturer =  manufacturerRepository.findById(addCarRequestDTO.manufacturer().id());
            if(addCarRequestDTO.manufacturer().name()=="" || !optionalManufacturer.isPresent()){
                throw new RuntimeException("Manufacturer not found");
            }
//            Manufacturer manufacturer = optionalManufacturer.get();
            Car car = CarMapper.INSTANCE.toCar(addCarRequestDTO, manufacturerRepository);
//            car.setManufacturer(manufacturer);
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
        if(!manufacturerRepository.findById(addCarDetailsRequestDTO.car().manufacturer()).isPresent()){
            throw new RuntimeException("Manufacturer not found");
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
    @Transactional
    public Car updateCar(UpdateCarRequestDTO updateCarRequestDTO) {
        // Tìm xe theo ID. Nếu không tồn tại, ném ra ngoại lệ.
        Car car = carRepository.findById(updateCarRequestDTO.id())
                .orElseThrow(() -> new RuntimeException("Car not found"));

        // Cập nhật các thuộc tính của xe từ DTO
        car.setName(updateCarRequestDTO.name());
        car.setModel(updateCarRequestDTO.model());
        car.setPrice(updateCarRequestDTO.price());
        car.setThumbnail(updateCarRequestDTO.thumbnail());
        car.setYearManufacture(updateCarRequestDTO.yearManufacturer());

        // Cập nhật danh sách Specification và Attribute nếu có
        if (updateCarRequestDTO.specifications() != null) {
            List<SpecificationRequestDTO> specificationRequestDTOS = updateCarRequestDTO.specifications();
            specificationRequestDTOS.forEach(specificationRequestDTO -> {
                Specification specification = specificationRepository.findById(specificationRequestDTO.id())
                        .orElseThrow(() -> new RuntimeException("Specification not found"));
                specification.setName(specificationRequestDTO.name());
                specificationRepository.save(specification);

                List<AttributeRequestDTO> attributeRequestDTOS = specificationRequestDTO.attributes();
                attributeRequestDTOS.forEach(attributeRequestDTO -> {
                    CarAttribute carAttribute = carAttributeRepository.findByCarIdAndAttributeId(car.getId(), attributeRequestDTO.id())
                            .orElseGet(() -> {
                                Attribute attribute = CarMapper.INSTANCE.toAttribute(attributeRequestDTO);
                                return CarAttribute.builder()
                                        .car(car)
                                        .attribute(attribute)
                                        .value(attributeRequestDTO.value())
                                        .build();
                            });
                    carAttribute.setValue(attributeRequestDTO.value());
                    carAttributeRepository.save(carAttribute);
                });
            });
        }
        // Lưu lại các thay đổi vào database
        return carRepository.save(car);
    }

    @Override
    @Transactional
    public void deleteCar(int id) {
        // Tìm kiếm và xóa xe dựa trên ID. Nếu không tìm thấy xe, ném ngoại lệ.
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        // Xóa các CarAttribute liên quan đến chiếc xe
        List<CarAttribute> carAttributes = carAttributeRepository.findAllByCarId(id);
        carAttributeRepository.deleteAll(carAttributes);

        // Sau đó xóa xe khỏi repository
        carRepository.delete(car);
    }

    @Override
    public CarImage createCarImage(int carId, AddCarImageRequestDTO addCarImageRequestDTO) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        CarImage carImage = CarMapper.INSTANCE.toCarImage(addCarImageRequestDTO);
        carImage.setCar(car);
        return carImageRepository.save(carImage);
    }

    @Override
    public Object uploadImages(int id, List<MultipartFile> files) {
        try {
            carRepository.findById(id).orElseThrow(() -> new RuntimeException("Car not found"));
            files = files == null ? new ArrayList<>() : files;
            if(files.size() > CarImage.MAXIMUM_IMAGES_PER_PRODUCT){
                return ResponseEntity.badRequest().body("You can only upload maximum 5 images");
            }
            List<CarImage> carImages = new ArrayList<>();
            for(MultipartFile file : files){
                if(file != null) {
                    if(file.getSize() == 0){
                        continue;
                    }
                    if (file.getSize() > 10 * 1024 * 1024) {
                        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                                .body("File is too large! maximum size is 10MB");
                    }
                }
                String contentType = file.getContentType();
                if(contentType == null || !contentType.startsWith("image/")){
                    return ResponseEntity.badRequest().body("File is not an image");
                }
                String fileName = storeFile(file);
                AddCarImageRequestDTO addCarImageRequestDTO = new AddCarImageRequestDTO(id, fileName);
                CarImage carImage = CarMapper.INSTANCE.toCarImage(addCarImageRequestDTO);
                carImages.add(carImage);
                createCarImage(id, addCarImageRequestDTO);
            }
            return ResponseEntity.ok(carImages);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Page<CarResponseDTO> searchCars(String keyword,Pageable pageable) {
        return carRepository.searchCars(keyword, pageable).map(CarMapper.INSTANCE::toCarResponseDTO);
    }

    @Override
    @Transactional
    public void increaseViewCount(int carId) {
        Optional<Car> optionalCar = carRepository.findById(carId);
        if(optionalCar.isPresent()){
            Car car = optionalCar.get();
            CarView carView = carViewRepository.findByCarId(carId).orElseGet(() -> {
                CarView newCarView = new CarView();
                newCarView.setCar(car);
                newCarView.setViewCount(0);
                return newCarView;
            });
            carView.setViewCount(carView.getViewCount() + 1);
            carViewRepository.save(carView);
        }
    }

    @Override
    public List<CarView> getTopCar() {
        return carViewRepository.getTopCar();
    }

    @Override
    @Transactional
    public Object updateThumbnail(int carId, MultipartFile file) {
        try {
            Car car = carRepository.findById(carId).orElseThrow(() -> new RuntimeException("Car not found"));
            if (file.getSize() > 10 * 1024 * 1024) {
                return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                        .body("File is too large! maximum size is 10MB");
            }
            String contentType = file.getContentType();
            if(contentType == null || !contentType.startsWith("image/")){
                return ResponseEntity.badRequest().body("File is not an image");
            }
            String fileName = storeFile(file);
            car.setThumbnail(fileName);
            carRepository.save(car);
            return ResponseEntity.ok(car);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private String storeFile(MultipartFile file) throws Exception{
        if(isImageFile(file) || file.getOriginalFilename() == null){
            throw new IOException("Invalid image format");
        }
        String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        // them uuid vao truoc ten file de dam bao file la duy nhat
        String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
        // duong dan den thu muc ban muon luu file
        Path path = Paths.get(System.getProperty("user.dir"));
        java.nio.file.Path uploadDir = path.resolve("uploads");

        // kiem tra va tao thu muc neu no khong ton tai
        if(!Files.exists(uploadDir)){
            Files.createDirectory(uploadDir);
        }
        // duong dan day du den file
        java.nio.file.Path destination = Paths.get(uploadDir.toString(), uniqueFileName);
        // sao chep file vao thu muc dich
        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
        return uniqueFileName;
    }

    private boolean isImageFile(MultipartFile file){
        String contentType = file.getContentType();
        return contentType == null || !contentType.startsWith("image/");
    }
}
