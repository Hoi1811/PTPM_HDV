package hdv_group11.CarSystem.domain.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "attributes")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Attribute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "specification_id")
    private Specification specification;

}
