package hdv_group11.CarSystem.repositories;

import hdv_group11.CarSystem.domain.models.CarAttribute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarAttributeRepository extends JpaRepository<CarAttribute, Integer> {
    List<CarAttribute> findAllByCarId(int id);
}
