package hdv_group11.CarSystem.services.implement;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import hdv_group11.CarSystem.domain.dtos.responses.CarResponseDTO;
import hdv_group11.CarSystem.services.IRedisCarService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class RedisCarService implements IRedisCarService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper redisObjectMapper;

    private String getKeyFrom(String keyword, PageRequest pageRequest){
        int page = pageRequest.getPageNumber();
        int limit = pageRequest.getPageSize();
        Sort sortBy = pageRequest.getSort();
        String sortDirection = sortBy.getOrderFor("id").getDirection() == Sort.Direction.ASC ? "ASC" : "DESC";
        return String.format("car:%s:%d:%d:%s", keyword, page, limit, sortDirection);
    }

    @Override
    public void clear() {
        redisTemplate.getConnectionFactory().getConnection().flushAll();
    }

    @Override
    public void saveAllCars(List<CarResponseDTO> carResponseDTOS, String keyword, PageRequest pageRequest)  throws JsonProcessingException {
        String key = this.getKeyFrom(keyword, pageRequest);
        String json = redisObjectMapper.writeValueAsString(carResponseDTOS);
        redisTemplate.opsForValue().set(key, json);
    }

    @Override
    public List<CarResponseDTO> getAllCars(String keyword, PageRequest pageRequest) throws JsonProcessingException {
        String key = this.getKeyFrom(keyword, pageRequest);
        String json = (String) redisTemplate.opsForValue().get(key);
        List<CarResponseDTO> carResponseDTOS = json != null ? redisObjectMapper.readValue(json, new TypeReference<List<CarResponseDTO>>() {}): null;
        return carResponseDTOS;
    }
}
