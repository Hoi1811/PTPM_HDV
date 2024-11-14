package hdv_group11.CarSystem.services;

import hdv_group11.CarSystem.domain.models.Manufacturer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IManufacturerService extends JpaRepository<Manufacturer, Integer> {
    Manufacturer findByName(String name);
}
