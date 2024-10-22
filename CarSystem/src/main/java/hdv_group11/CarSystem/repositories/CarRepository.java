package hdv_group11.CarSystem.repositories;

import hdv_group11.CarSystem.domain.models.Car;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarRepository extends JpaRepository<Car, Integer> {
}
