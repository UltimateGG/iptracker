package ucm.iptracker;

import io.jsonwebtoken.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import ucm.iptracker.model.User;

import java.util.Date;
import java.util.concurrent.TimeUnit;


@Component
public class JwtUtil {
	private final String SECRET_KEY = System.getenv("SECRET_KEY");
	private final long ACCESS_TOKEN_EXPIRATION_HOURS = 1; // 1 day token expiration
	private final String TOKEN_PREFIX = "Bearer ";

	private final JwtParser jwtParser;


	public JwtUtil(){
		this.jwtParser = Jwts.parser().setSigningKey(SECRET_KEY);
	}

	public String createToken(User user) {
		Claims claims = Jwts.claims();
		claims.put("id",user.getId());
		claims.put("username",user.getUsername());

		Date tokenValidity = new Date(new Date().getTime() + TimeUnit.DAYS.toMillis(ACCESS_TOKEN_EXPIRATION_HOURS));

		return Jwts.builder()
				.setClaims(claims)
				.setExpiration(tokenValidity)
				.signWith(SignatureAlgorithm.HS256, SECRET_KEY)
				.compact();
	}

	private Claims parseJwtClaims(String token) {
		return jwtParser.parseClaimsJws(token).getBody();
	}

	public Claims resolveClaims(HttpServletRequest req) {
		try {
			String token = resolveToken(req);

			if (token != null) return parseJwtClaims(token);
			return null;
		} catch (ExpiredJwtException ex) {
			req.setAttribute("expired", ex.getMessage());
			throw ex;
		} catch (Exception ex) {
			req.setAttribute("invalid", ex.getMessage());
			throw ex;
		}
	}

	public String resolveToken(HttpServletRequest request) {
		String bearerToken = request.getHeader("Authorization");

		if (bearerToken != null && bearerToken.startsWith(TOKEN_PREFIX))
			return bearerToken.substring(TOKEN_PREFIX.length());

		return null;
	}

	public boolean isExpired(Claims claims) {
		return claims.getExpiration().after(new Date());
	}
}
