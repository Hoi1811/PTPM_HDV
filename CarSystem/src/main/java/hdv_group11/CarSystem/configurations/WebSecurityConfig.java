package hdv_group11.CarSystem.configurations;

import hdv_group11.CarSystem.filters.JwtTokenFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

import static org.springframework.http.HttpMethod.*;

@EnableMethodSecurity
@Configuration
@RequiredArgsConstructor
public class WebSecurityConfig {
    @Value("${api.prefix}")
    private String apiPrefix;

    private final JwtTokenFilter jwtTokenFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(request -> {

                    request.requestMatchers(
                                    String.format("%s/users/register", apiPrefix),
                                    String.format("%s/users/login", apiPrefix))
                            .permitAll()
                            .requestMatchers(GET, String.format("%s/car", apiPrefix)).permitAll()
                            .requestMatchers(POST, String.format("%s/car", apiPrefix)).hasRole("ADMIN")
                            .requestMatchers(POST, String.format("%s/users", apiPrefix)).hasRole("ADMIN")
                            .requestMatchers(PUT, String.format("%s/users", apiPrefix)).hasRole("ADMIN")
                            .requestMatchers(DELETE, String.format("%s/users", apiPrefix)).permitAll()
                            .anyRequest().permitAll();
                })
                .csrf(AbstractHttpConfigurer::disable);
        // Cấu hình CORS cho tất cả các request
//        http.cors(new Customizer<CorsConfigurer<HttpSecurity>>() {
//            @Override
//            public void customize(CorsConfigurer<HttpSecurity> httpSecurityCorsConfigurer) {
//                CorsConfiguration corsConfiguration = new CorsConfiguration();
//                corsConfiguration.addAllowedOrigin("*");
//                corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//                corsConfiguration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "x-auth-token"));
//                corsConfiguration.setExposedHeaders(List.of("x-auth-token"));
//
//
//                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//                source.registerCorsConfiguration("/**", corsConfiguration);
//
//                httpSecurityCorsConfigurer.configurationSource(source);
//            }
//        });


        return http.build();
    }
}