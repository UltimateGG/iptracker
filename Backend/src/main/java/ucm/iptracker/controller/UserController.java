package ucm.iptracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ucm.iptracker.APIException;
import ucm.iptracker.model.User;
import ucm.iptracker.repository.ApplicationInfoRepo;
import ucm.iptracker.repository.ServerInfoRepo;
import ucm.iptracker.repository.UserRepo;
import ucm.iptracker.service.UserService;


@RestController
@RequestMapping("/users")
public class UserController {
	private final ApplicationInfoRepo appInfoRepo;
	private final ServerInfoRepo serverInfoRepo;
	private final UserRepo userRepo;
	private final UserService userService;


	@Autowired
	public UserController(ApplicationInfoRepo appInfoRepo, ServerInfoRepo serverInfoRepo, UserService userService, UserRepo userRepo) {
		this.appInfoRepo = appInfoRepo;
		this.serverInfoRepo = serverInfoRepo;
		this.userService = userService;
		this.userRepo = userRepo;
	}

	@GetMapping("/{id}")
	public User getUser(@PathVariable int id) {
		return userRepo.findById(id).orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "User not found"));
	}
}
