package hdv_group11.CarSystem.domain.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "car_attribute")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class CarAttribute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "car_id")
    private Car car;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "attribute_id")
    private Attribute attribute;

    private String value;
}
