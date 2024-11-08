package hdv_group11.CarSystem.repositories;

import hdv_group11.CarSystem.domain.models.CarAttribute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CarAttributeRepository extends JpaRepository<CarAttribute, Integer> {
    List<CarAttribute> findAllByCarId(int id);

    Optional<CarAttribute> findByCarIdAndAttributeId(int carId, int attributeId);
}
