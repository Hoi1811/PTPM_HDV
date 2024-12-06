package hdv_group11.CarSystem.repositories;

import hdv_group11.CarSystem.domain.models.CarView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CarViewRepository extends JpaRepository<CarView, Integer> {
    @Query(
            "UPDATE CarView c SET c.viewCount = c.viewCount + 1 WHERE c.car.id = :carId"
    )
    void increaseViewCount(@Param("carId") int carId);

    Optional<CarView> findByCarId(int carId);

    @Query(
            "SELECT c FROM CarView c ORDER BY c.viewCount DESC"
    )
    List<CarView> getTopCar();
}
