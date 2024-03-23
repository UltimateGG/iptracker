package ucm.iptracker.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import ucm.iptracker.model.User;

import java.util.Date;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;


@Component
public class JwtUtil {
	private final String SECRET_KEY = System.getenv("SECRET_KEY");
	private final int ACCESS_TOKEN_EXPIRATION_HOURS = 1; // 1 day token expiration

	private final JwtParser jwtParser;


	public JwtUtil(){
		this.jwtParser = Jwts.parser().setSigningKey(SECRET_KEY);
	}

	public String generateToken(User user) {
		return Jwts.builder()
				.setSubject(user.getUsername())
				.claim("id", user.getId())
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + TimeUnit.DAYS.toMillis(ACCESS_TOKEN_EXPIRATION_HOURS)))
				.signWith(SignatureAlgorithm.HS256, SECRET_KEY)
				.compact();
	}

	private <T> T extractClaims(String token, Function<Claims, T> claimsTFunction){
		return claimsTFunction.apply(jwtParser.parseClaimsJws(token).getBody());
	}

	public boolean isTokenValid(String token, UserDetails userDetails){
		String username = extractUsername(token);
		return (username.equals(userDetails.getUsername()) && !isExpired(token));
	}

	public String extractUsername(String token){
		return extractClaims(token, Claims::getSubject);
	}

	public boolean isExpired(String token) {
		return extractClaims(token, Claims::getExpiration).before(new Date());
	}
}
