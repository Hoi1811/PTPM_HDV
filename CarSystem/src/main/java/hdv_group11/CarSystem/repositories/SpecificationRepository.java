package hdv_group11.CarSystem.repositories;

import hdv_group11.CarSystem.domain.models.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpecificationRepository extends JpaRepository<Specification, Integer> {
}
