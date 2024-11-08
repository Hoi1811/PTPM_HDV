package hdv_group11.CarSystem.repositories;

import hdv_group11.CarSystem.domain.dtos.ManufacturerRequestDTO;
import hdv_group11.CarSystem.domain.models.Manufacturer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ManufactureRepository extends JpaRepository<Manufacturer, Integer> {

    Optional<Object> findById(ManufacturerRequestDTO manufacturer);
}
