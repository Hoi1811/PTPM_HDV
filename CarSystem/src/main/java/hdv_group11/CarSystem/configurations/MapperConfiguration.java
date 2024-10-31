package hdv_group11.CarSystem.configurations;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfiguration {
    public ModelMapper modelMapper(){
        return new ModelMapper();
    }
}
