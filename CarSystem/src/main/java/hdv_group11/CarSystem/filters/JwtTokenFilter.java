package hdv_group11.CarSystem.filters;

import hdv_group11.CarSystem.domain.models.User;
import hdv_group11.CarSystem.components.JwtTokenUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@RequiredArgsConstructor
@Component
public class JwtTokenFilter extends OncePerRequestFilter {
    @Value("${api.prefix}")
    private String apiPrefix;

    private final UserDetailsService userDetailsService;
    private final JwtTokenUtils jwtTokenUtil;

    @Override
    protected void doFilterInternal(@NotNull HttpServletRequest request,
                                    @NotNull HttpServletResponse response,
                                    @NotNull FilterChain filterChain) throws IOException {
        try {
//            System.out.println("Incoming request: " + request.getRequestURI() + " | Method: " + request.getMethod());
            if(isTokenBypass(request)){
                filterChain.doFilter(request, response);
                return;
            }
            final String authHeader = request.getHeader("Authorization");
            if(authHeader == null || !authHeader.startsWith("Bearer ")){
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                return;
            }
            final String token = authHeader.substring(7);
            final String phoneNumber = jwtTokenUtil.extractPhoneNumber(token);
            if(phoneNumber != null
                    && SecurityContextHolder.getContext().getAuthentication() == null){
                User user = (User) userDetailsService.loadUserByUsername(phoneNumber);
                if(jwtTokenUtil.validateToken(token, user)){
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            user,
                            null,
                            user.getAuthorities()
                    );
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
            filterChain.doFilter(request, response);
        }catch (Exception e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
        }
    }
    public boolean isTokenBypass(@NotNull HttpServletRequest request){
        final List<Pair<String, String>> bypassTokens = Arrays.asList(
                Pair.of(String.format("%s/users/register", apiPrefix), "POST"),
                Pair.of(String.format("%s/users/login", apiPrefix), "POST"),
                Pair.of(String.format("%s/car", apiPrefix), "GET"),
                Pair.of(String.format("%s/email", apiPrefix), "GET"),
                Pair.of(String.format("/actuator", apiPrefix), "GET")
        );

        for (Pair<String, String> bypassToken : bypassTokens){
            if(request.getServletPath().contains(bypassToken.getFirst()) &&
                    request.getMethod().equals(bypassToken.getSecond())){
                return true;
            }
        }
        return false;
    }
}

