package hdv_group11.CarSystem.repositories;

import hdv_group11.CarSystem.domain.models.Car;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CarRepository extends JpaRepository<Car, Integer> {
    Optional<Object> findByName(String name);

    Optional<Object> findByModel(String model);

    @Query(
            "select c from Car c " +
                    "left join c.manufacturer m " +  // LEFT JOIN để không bỏ qua các bản ghi có manufacturer null
                    "where (:keyword is null or :keyword = '' or c.name like %:keyword% or m.name like %:keyword%)"
    )
    Page<Car> searchCars(
            @Param("keyword") String keyword,
            Pageable pageable
    );
}
