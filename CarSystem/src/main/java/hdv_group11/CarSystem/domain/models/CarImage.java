package hdv_group11.CarSystem.domain.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "car_images")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Getter
@Setter
public class CarImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "car_id")
    private Car car;

    @Column(name = "image_url")
    private String imageURL;

    public static final int MAXIMUM_IMAGES_PER_PRODUCT = 5;
}
