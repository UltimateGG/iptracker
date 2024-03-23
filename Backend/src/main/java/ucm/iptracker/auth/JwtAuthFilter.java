package ucm.iptracker.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import ucm.iptracker.service.UserService;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
	private final JwtUtil jwtUtil;
	private final UserService userService;

	private final String TOKEN_PREFIX = "Bearer ";


	@Autowired
	public JwtAuthFilter(JwtUtil jwtUtil, UserService userService) {
		this.jwtUtil = jwtUtil;
		this.userService = userService;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
		String authHeader = request.getHeader("Authorization");
		if (authHeader == null || authHeader.isBlank() || !authHeader.startsWith(TOKEN_PREFIX)) {
			filterChain.doFilter(request, response);
			return;
		}

		String token = authHeader.substring(TOKEN_PREFIX.length());
		String username = jwtUtil.extractUsername(token);
		if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			UserDetails userDetails = userService.loadUserByUsername(username);

			if (jwtUtil.isTokenValid(token, userDetails)) {
				SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
				UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
						userDetails, null, userDetails.getAuthorities()
				);

				authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				securityContext.setAuthentication(authToken);
				SecurityContextHolder.setContext(securityContext);
			}
		}

		filterChain.doFilter(request, response);
	}
}
