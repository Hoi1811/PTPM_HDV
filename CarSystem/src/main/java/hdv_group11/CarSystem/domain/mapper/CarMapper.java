package hdv_group11.CarSystem.domain.mapper;

import hdv_group11.CarSystem.domain.dtos.*;
import hdv_group11.CarSystem.domain.dtos.responses.*;
import hdv_group11.CarSystem.domain.models.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface CarMapper {
    CarMapper INSTANCE = Mappers.getMapper(CarMapper.class);

    Car toCar(AddCarRequestDTO addCarRequestDTO);

    @Mappings({
            @Mapping(source = "name", target = "name"),
            @Mapping(source = "yearManufacture", target = "yearManufacture"),
            @Mapping(source = "model", target = "model"),
            @Mapping(source = "price", target = "price"),
            @Mapping(source = "thumbnail", target = "thumbnail"),
            @Mapping(source = "manufacturer", target = "manufacturer"),
    })
    CarResponseDTO toCarResponseDTO(Car car);

    ManufacturerResponseDTO toManufacturerResponseDTO(Manufacturer manufacturer);

    SpecificationResponseDTO toSpecificationResponseDTO(Specification specification);

    @Mapping(source = "attribute.name", target = "name")
    @Mapping(source = "attribute.specification.id", target = "specificationId")
    AttributeResponseDTO toAttributeResponseDTO(CarAttribute carAttribute);

    CarDetailResponseDTO toCarDetailResponseDTO(Car car, List<SpecificationResponseDTO> specificationResponseDTOS);

    @Mappings({
            @Mapping(source = "car.name", target = "name"),
            @Mapping(source = "car.yearManufacture", target = "yearManufacture"),
            @Mapping(source = "car.model", target = "model"),
            @Mapping(source = "car.price", target = "price"),
            @Mapping(source = "car.thumbnail", target = "thumbnail"),
            @Mapping(source = "car.manufacturer", target = "manufacturer"),
    })
    Car toCar(AddCarDetailsRequestDTO addCarDetailsRequestDTO);

    Specification toSpecification(SpecificationRequestDTO specificationRequestDTO);

    @Mappings({
        @Mapping(source = "specificationId", target = "specification.id"),
    })
    Attribute toAttribute(AttributeRequestDTO attributeRequestDTO);

    Attribute toAttribute(AddAttributeRequestDTO addAttributeRequestDTO);

    CarImage toCarImage(AddCarImageRequestDTO addCarImageRequestDTO);
}
