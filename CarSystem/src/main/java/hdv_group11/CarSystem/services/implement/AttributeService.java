package hdv_group11.CarSystem.services.implement;

import hdv_group11.CarSystem.domain.dtos.AddAttributeRequestDTO;
import hdv_group11.CarSystem.domain.mapper.CarMapper;
import hdv_group11.CarSystem.domain.models.Attribute;
import hdv_group11.CarSystem.repositories.AttributeRepository;
import hdv_group11.CarSystem.services.IAttributeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

    @RequiredArgsConstructor
    @Service
    public class AttributeService implements IAttributeService {
        private final AttributeRepository attributeRepository;
        @Override
        public Attribute addAttribute(AddAttributeRequestDTO addAttributeRequestDTO) {
            Attribute attribute = CarMapper.INSTANCE.toAttribute(addAttributeRequestDTO);
            return attributeRepository.save(attribute);
        }

        @Override
        public List<Attribute> findAll() {
        return attributeRepository.findAll();
    }

    @Override
    public Attribute findById(int id) throws Exception {
        return attributeRepository.findById(id).orElseThrow(()-> new Exception("can not find attribute with id: " + id));
    }

}
