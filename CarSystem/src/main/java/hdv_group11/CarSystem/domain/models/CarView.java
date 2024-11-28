package hdv_group11.CarSystem.domain.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "car_views")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class CarView {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "car_id")
    private Car car;

    @Column(name = "view_count")
    private int viewCount;
}
