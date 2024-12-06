package hdv_group11.CarSystem.configurations;

import jakarta.annotation.PreDestroy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.TimeUnit;

@EnableAsync
@Configuration
public class AsyncConfig {
    private ThreadPoolTaskExecutor executor;
    @Bean
    public Executor taskExecutor() {
        executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4); // Số luồng lõi
        executor.setMaxPoolSize(8); // Số luồng tối đa
        executor.setQueueCapacity(50); // Dung lượng hàng đợi
        executor.setThreadNamePrefix("AsyncThread-");
        executor.initialize();
        return executor;
    }
    @PreDestroy
    public void shutdownExecutor() {
        System.out.println("Shutting down executor...");
        executor.shutdown();
        try {
            if (!executor.getThreadPoolExecutor().awaitTermination(60, TimeUnit.SECONDS)) {
                System.out.println("Forcing executor shutdown...");
                executor.getThreadPoolExecutor().shutdownNow();
            }
        } catch (InterruptedException e) {
            System.err.println("Executor interrupted during shutdown.");
            executor.getThreadPoolExecutor().shutdownNow();
        }
        System.out.println("Executor shut down successfully.");
    }
}
