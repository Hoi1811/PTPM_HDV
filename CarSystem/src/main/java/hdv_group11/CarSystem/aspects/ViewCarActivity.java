package hdv_group11.CarSystem.aspects;

import hdv_group11.CarSystem.services.implement.CarService;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class ViewCarActivity {

    private final CarService carService;

    @Pointcut("execution(* hdv_group11.CarSystem.controllers.CarController.getCarDetail(..)) && args(id)")
    public void getCarDetails(int id) {};

    @After("getCarDetails(id)")
    public void increaseViewCount(int id) {
        System.out.println("View count increased for car with id: " + id);
        carService.increaseViewCount(id);
    }
}
