package hdv_group11.CarSystem.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import hdv_group11.CarSystem.domain.dtos.AddCarDetailsRequestDTO;
import hdv_group11.CarSystem.domain.dtos.AddCarRequestDTO;
import hdv_group11.CarSystem.domain.dtos.UpdateCarRequestDTO;
import hdv_group11.CarSystem.domain.dtos.responses.CarDetailResponseDTO;
import hdv_group11.CarSystem.domain.dtos.responses.CarListResponseDTO;
import hdv_group11.CarSystem.domain.dtos.responses.CarResponseDTO;
import hdv_group11.CarSystem.domain.models.Car;
import hdv_group11.CarSystem.services.ICarService;
import hdv_group11.CarSystem.services.IRedisCarService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/car")
@RequiredArgsConstructor
public class CarController {
    private final ICarService iCarService;
    private final IRedisCarService iRedisCarService;

    @GetMapping("")
    public ResponseEntity<?> getAllCars(
        @RequestParam("page") int page,
        @RequestParam("limit") int limit
    ) throws JsonProcessingException {
        PageRequest pageRequest = PageRequest.of(
                page, limit,
                Sort.by("id").ascending()
        );
        Page<CarResponseDTO> cars = iRedisCarService.getAllCars(pageRequest);
        if(cars == null){
            cars = iCarService.getAllCars(pageRequest);
            iRedisCarService.saveAllCars(cars, pageRequest);
            return ResponseEntity.ok(cars);
        }
        return ResponseEntity.ok(cars);

    }
    @GetMapping("searchCar")
    public ResponseEntity<?> searchCarByNameOrManufacturer(
            @RequestParam("keyword") String keyword,
            @RequestParam("page") int page,
            @RequestParam("limit") int limit,
            @RequestParam(defaultValue = "name") String sort,
            @RequestParam(defaultValue = "ASC") String direction
    ) throws JsonProcessingException {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sortBy = Sort.by(sortDirection, sort);
        Pageable pageable = PageRequest.of(
                page, limit, sortBy
        );
        Page<CarResponseDTO> cars = iRedisCarService.getAllCars(keyword, (PageRequest) pageable);
        if(cars == null){
            cars = iCarService.searchCars(keyword, pageable);
            iRedisCarService.saveAllCars(cars, keyword, (PageRequest) pageable);
            return ResponseEntity.ok(cars);
        }
        return ResponseEntity.ok(cars);
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
    public ResponseEntity<?> updateCar(UpdateCarRequestDTO car){
        return ResponseEntity.ok(iCarService.updateCar(car));
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCar(@PathVariable int id){
        iCarService.deleteCar(id);
        return ResponseEntity.ok("Deleted");
    }

    @PostMapping(value = "upload/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImages(
            @PathVariable("id") int id,
            @ModelAttribute("files") List<MultipartFile> files
    ){
        return ResponseEntity.ok(iCarService.uploadImages(id, files));
    }

    @GetMapping("/top")
    public ResponseEntity<?> getTopCar(){
        return ResponseEntity.ok(iCarService.getTopCar());
    }

    @GetMapping("/images/{imageName}")
    public ResponseEntity<?> getImage(@PathVariable("imageName") String imageName){
        try {
            Path path = Paths.get(System.getProperty("user.dir"));
            java.nio.file.Path imagePath = path.resolve("uploads/" + imageName);
            UrlResource resource = new UrlResource(imagePath.toUri());
            if(resource.exists()){
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            }else{
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    @PostMapping("/thumbnail/{id}")
    public ResponseEntity<?> updateThumbnail(
            @PathVariable("id") int id,
            @RequestParam("file") MultipartFile file
    ){
        return ResponseEntity.ok(iCarService.updateThumbnail(id, file));
    }
}
