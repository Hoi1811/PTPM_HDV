//package hdv_group11.CarSystem.components;
//
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Component;
//import org.springframework.web.servlet.HandlerInterceptor;
//
//import java.time.LocalDateTime;
//import java.util.concurrent.ConcurrentHashMap;
//
//@Component
//public class AccessLoggingInterceptor implements HandlerInterceptor {
//    private static final ConcurrentHashMap<String, LocalDateTime> onlineUsers = new ConcurrentHashMap<>();
//
//    @Override
//    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
//        String ip = request.getRemoteAddr();
//        onlineUsers.put(ip, LocalDateTime.now());
//        return true;
//    }
//    public static int getOnlineUserCount() {
//        // Đếm số IP trong thời gian 5 phút gần đây
//        LocalDateTime now = LocalDateTime.now();
//        onlineUsers.entrySet().removeIf(entry -> entry.getValue().isBefore(now.minusMinutes(5)));
//        return onlineUsers.size();
//    }
//
//    public static void logDailyAccess() {
//        System.out.println("Total access today: " + onlineUsers.size());
//    }
//}
