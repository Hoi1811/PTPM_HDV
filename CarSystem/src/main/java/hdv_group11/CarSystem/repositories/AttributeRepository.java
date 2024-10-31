package hdv_group11.CarSystem.repositories;

import hdv_group11.CarSystem.domain.models.Attribute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttributeRepository extends JpaRepository<Attribute, Integer> {

}
