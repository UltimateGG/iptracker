package ucm.iptracker.controller;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ucm.iptracker.APIException;
import ucm.iptracker.auth.JwtUtil;
import ucm.iptracker.model.User;
import ucm.iptracker.repository.UserRepo;


@RestController()
@RequestMapping("/auth")
public class AuthController {
	private final AuthenticationManager authenticationManager;
	private final UserRepo userRepo;
	private final JwtUtil jwtUtil;


	@Autowired
	public AuthController(AuthenticationManager authenticationManager, UserRepo userRepo, JwtUtil jwtUtil) {
		this.authenticationManager = authenticationManager;
		this.userRepo = userRepo;
		this.jwtUtil = jwtUtil;
	}

	@PostMapping("/login")
	public LoginResponse login(@RequestBody LoginRequest loginRequest) {
		if (loginRequest.username == null || loginRequest.password == null)
			throw new APIException(HttpStatus.BAD_REQUEST, "Username and password are required");

		User user = userRepo.findByUsername(loginRequest.username);
		if (user == null || !user.getPassword().equals(loginRequest.password))
			throw new APIException(HttpStatus.BAD_REQUEST, "Invalid username or password");

		authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.username, loginRequest.password));

		return new LoginResponse(jwtUtil.generateToken(user));
	}

	private static final class LoginRequest {
		public String username;
		public String password;
	}

	@RequiredArgsConstructor
	private static final class LoginResponse {
		@NonNull
		public String token;
	}
}
