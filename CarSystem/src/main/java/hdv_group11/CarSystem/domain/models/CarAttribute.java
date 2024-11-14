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
    @JoinColumn(name = "car_id", foreignKey = @ForeignKey(name = "FK_CAR_ATTRIBUTE_CAR", foreignKeyDefinition = "FOREIGN KEY (car_id) REFERENCES car(id) ON DELETE CASCADE"))
    private Car car;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "attribute_id")
    private Attribute attribute;

    private String value;
}
