package ucm.iptracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ucm.iptracker.APIException;
import ucm.iptracker.model.Application;
import ucm.iptracker.model.User;
import ucm.iptracker.model.UserApps;
import ucm.iptracker.repository.UserAppsRepo;
import ucm.iptracker.repository.UserRepo;
import ucm.iptracker.service.UserService;

import java.util.List;


@RestController
@RequestMapping("/users")
public class UserController {
	private final UserRepo userRepo;
	private final UserAppsRepo userAppsRepo;


	@Autowired
	public UserController(UserRepo userRepo, UserAppsRepo userAppsRepo) {
		this.userRepo = userRepo;
		this.userAppsRepo = userAppsRepo;
	}

	@GetMapping("/{id}")
	public User getUser(@PathVariable int id) {
		return userRepo.findById(id).orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "User not found"));
	}

	@GetMapping("/{id}/apps")
	public List<Application> getUsersApps(Authentication auth, @PathVariable int id) {
		User user = (User) auth.getPrincipal();

		if (user.getId() == id || user.getRole() == User.Role.ADMIN)
			return userAppsRepo.findAllByUser_Id(id).stream().map(UserApps::getApplication).toList();

		throw new APIException(HttpStatus.FORBIDDEN, "You are not allowed to view this user's apps");
	}
}
