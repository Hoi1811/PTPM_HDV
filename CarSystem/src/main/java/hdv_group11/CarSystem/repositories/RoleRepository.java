package hdv_group11.CarSystem.repositories;

import hdv_group11.CarSystem.domain.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(String name);

    Optional<Role> findById(Long aLong);
}
