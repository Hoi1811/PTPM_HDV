package hdv_group11.CarSystem.services;

import hdv_group11.CarSystem.domain.dtos.AddAttributeRequestDTO;
import hdv_group11.CarSystem.domain.models.Attribute;

import java.util.List;

public interface IAttributeService {
    Attribute addAttribute(AddAttributeRequestDTO addAttributeRequestDTO);

    List<Attribute> findAll();

    Attribute findById(int id) throws Exception;
}
