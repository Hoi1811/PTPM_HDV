package hdv_group11.CarSystem.repositories;

import hdv_group11.CarSystem.domain.models.CarImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarImageRepository extends JpaRepository<CarImage, Integer> {
    List<CarImage> findAllByCarId(int carId);
}
