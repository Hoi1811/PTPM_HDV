package hdv_group11.CarSystem.aspects;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicInteger;

@Aspect
@Component
@Slf4j
public class UserActivityLogger {
    private final AtomicInteger userCounter = new AtomicInteger(0);

    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void controllerMethods(){}

    @Pointcut("within(*hdv_group11.CarSystem.controllers.CarController)")
    public void carController() {};

    @Before("controllerMethods()")
    public Object logUserActivity(JoinPoint joinPoint) {
        log.info("thanh cong roi");
        return null;
    }

    @After("carController()")
    public void logCarControllerActivity(JoinPoint joinPoint) {
        log.info("Car controller activity: " + joinPoint.getSignature().getName());
    }



}
