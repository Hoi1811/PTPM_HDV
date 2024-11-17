package hdv_group11.CarSystem.controllers;

import hdv_group11.CarSystem.domain.dtos.AddCarDetailsRequestDTO;
import hdv_group11.CarSystem.domain.dtos.AddCarRequestDTO;
import hdv_group11.CarSystem.domain.dtos.responses.CarDetailResponseDTO;
import hdv_group11.CarSystem.domain.dtos.responses.CarListResponseDTO;
import hdv_group11.CarSystem.domain.dtos.responses.CarResponseDTO;
import hdv_group11.CarSystem.domain.models.Car;
import hdv_group11.CarSystem.services.ICarService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/car")
@RequiredArgsConstructor
public class CarController {
    private final ICarService iCarService;

    @GetMapping("")
    public ResponseEntity<CarListResponseDTO> getAllCars(
        @RequestParam("page") int page,
        @RequestParam("limit") int limit
    ){
        PageRequest pageRequest = PageRequest.of(
                page, limit,
                Sort.by("id").ascending()
        );
        Page<CarResponseDTO> carPage = iCarService.getAllCars(pageRequest);
        int totalPage = carPage.getTotalPages();
        List<CarResponseDTO> cars = carPage.getContent();
        return ResponseEntity.ok(CarListResponseDTO.builder()
                .cars(cars)
                .totalPage(totalPage)
                .build()
        );
    }
    @GetMapping("searchCar")
    public ResponseEntity<?> searchCarByNameOrManufacturer(
            @RequestParam("keyword") String keyword,
            @RequestParam("page") int page,
            @RequestParam("limit") int limit,
            @RequestParam(defaultValue = "name") String sort,
            @RequestParam(defaultValue = "ASC") String direction
    ){
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sortBy = Sort.by(sortDirection, sort);
        Pageable pageable = PageRequest.of(
                page, limit, sortBy
        );
        return ResponseEntity.ok(iCarService.searchCars(keyword, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarDetailResponseDTO> getCarDetail(@PathVariable("id") int id){
        return ResponseEntity.ok(iCarService.getCarDetail(id));
    }
    @GetMapping("/list")
    public ResponseEntity<List<CarDetailResponseDTO>> getCarDetailList(@RequestBody List<Integer> ids){
        return ResponseEntity.ok(iCarService.getCarDetailList(ids));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addCar(@RequestBody AddCarRequestDTO addCarRequestDTO){
        return ResponseEntity.ok(iCarService.createCar(addCarRequestDTO));
    }

    @PostMapping("/addDetail")
    public ResponseEntity<?> addCarDetail(@RequestBody AddCarDetailsRequestDTO addCarDetailsRequestDTO){
        return ResponseEntity.ok(iCarService.createCarDetail(addCarDetailsRequestDTO));
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateCar(Car car){
        return null;
    }
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteCar(int id){
        return null;
    }

    @PostMapping(value = "upload/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImages(
            @PathVariable("id") int id,
            @ModelAttribute("files") List<MultipartFile> files
    ){
        return ResponseEntity.ok(iCarService.uploadImages(id, files));
    }
}
