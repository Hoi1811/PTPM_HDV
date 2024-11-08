package hdv_group11.CarSystem.controllers;

import hdv_group11.CarSystem.domain.dtos.AddAttributeRequestDTO;
import hdv_group11.CarSystem.domain.models.Attribute;
import hdv_group11.CarSystem.services.implement.AttributeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/attribute")
@RequiredArgsConstructor
public class AttributeController {
    private final AttributeService attributeService;
    @GetMapping("")
    public ResponseEntity<?> getAttribute(){
        return ResponseEntity.ok(attributeService.findAll());
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getAttributeById(@PathVariable int id) throws Exception {
        return ResponseEntity.ok(attributeService.findById(id));
    }
    @PostMapping("/add")
    public ResponseEntity<?> addAttribute(@RequestBody AddAttributeRequestDTO addAttributeRequestDTO){
        return ResponseEntity.ok(attributeService.addAttribute(addAttributeRequestDTO));
    }

}

