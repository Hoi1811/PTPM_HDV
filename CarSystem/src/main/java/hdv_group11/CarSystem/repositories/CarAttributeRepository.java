package hdv_group11.CarSystem.repositories;

import hdv_group11.CarSystem.domain.models.CarAttribute;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarAttributeRepository extends JpaRepository<CarAttribute, Integer> {
}
