package hdv_group11.CarSystem.domain.mapper;

import hdv_group11.CarSystem.domain.dtos.AddCarDetailsRequestDTO;
import hdv_group11.CarSystem.domain.dtos.AddCarRequestDTO;
import hdv_group11.CarSystem.domain.dtos.AttributeRequestDTO;
import hdv_group11.CarSystem.domain.dtos.SpecificationRequestDTO;
import hdv_group11.CarSystem.domain.dtos.responses.*;
import hdv_group11.CarSystem.domain.models.Attribute;
import hdv_group11.CarSystem.domain.models.Car;
import hdv_group11.CarSystem.domain.models.CarAttribute;
import hdv_group11.CarSystem.domain.models.Specification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface CarMapper {
    CarMapper INSTANCE = Mappers.getMapper(CarMapper.class);

    Car toCar(AddCarRequestDTO addCarRequestDTO);

    CarResponseDTO toCarResponseDTO(Car car);

    SpecificationResponseDTO toSpecificationResponseDTO(Specification specification);

    @Mapping(source = "attribute.name", target = "name")
    @Mapping(source = "attribute.specification.id", target = "specificationId")
    AttributeResponseDTO toAttributeResponseDTO(CarAttribute carAttribute);

    CarDetailResponseDTO toCarDetailResponseDTO(Car car, List<SpecificationResponseDTO> specificationResponseDTOS);

    @Mappings({@Mapping(source = "car.name", target = "name"),
            @Mapping(source = "car.yearManufacture", target = "yearManufacture"),
            @Mapping(source = "car.model", target = "model"),
            @Mapping(source = "car.price", target = "price")})
    Car toCar(AddCarDetailsRequestDTO addCarDetailsRequestDTO);

    Specification toSpecification(SpecificationRequestDTO specificationRequestDTO);

    @Mappings({
        @Mapping(source = "specificationId", target = "specification.id"),
    })
    Attribute toAttribute(AttributeRequestDTO attributeRequestDTO);


}
