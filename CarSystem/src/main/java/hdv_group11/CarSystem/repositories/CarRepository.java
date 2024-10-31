package hdv_group11.CarSystem.repositories;

import hdv_group11.CarSystem.domain.models.Car;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CarRepository extends JpaRepository<Car, Integer> {
    Optional<Object> findByName(String name);

    Optional<Object> findByModel(String model);
}
