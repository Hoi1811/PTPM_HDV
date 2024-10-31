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
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
                Sort.by("name").descending()
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

}
