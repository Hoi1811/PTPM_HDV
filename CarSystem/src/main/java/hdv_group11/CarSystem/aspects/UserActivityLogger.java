package hdv_group11.CarSystem.aspects;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class UserActivityLogger {

    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void controllerMethods(){}

    @Before("controllerMethods()")
    public Object logUserActivity(JoinPoint joinPoint) {
        log.info("thanh cong roi");
        return null;
    }
}
