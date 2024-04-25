package ucm.iptracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ucm.iptracker.APIException;
import ucm.iptracker.model.Application;
import ucm.iptracker.model.User;
import ucm.iptracker.repository.ApplicationRepo;
import ucm.iptracker.service.ApplicationService;
import ucm.iptracker.service.UserService;

import java.util.List;


@RestController
@RequestMapping("/apps")
public class ApplicationController {
	private final UserService userService;
	private final ApplicationService appService;
	private final ApplicationRepo appRepo;

	@Autowired
	public ApplicationController(UserService userService, ApplicationService appService, ApplicationRepo appRepo) {
		this.userService = userService;
		this.appService = appService;
		this.appRepo = appRepo;
	}

	@GetMapping
	public List<Application> getAllApps(Authentication auth) {
		User user = (User) auth.getPrincipal();

		return userService.getAllowedApplications(user.getId());
	}

	@PostMapping
	public Application createApp(Authentication auth, @RequestBody CreateApplicationBody app) {
		User user = (User) auth.getPrincipal();
		if (user.getRole() != User.Role.ADMIN)
			throw new APIException(HttpStatus.FORBIDDEN, "You are not allowed to access this resource");

		return appService.createApplication(app.description, app.allowedUsers);
	}

	@PutMapping("/{id}")
	public Application updateApp(Authentication auth, @PathVariable int id, @RequestBody Application application) {
		User user = (User) auth.getPrincipal();
		if (user.getRole() != User.Role.ADMIN)
			throw new APIException(HttpStatus.FORBIDDEN, "You are not allowed to access this resource");

		Application current = appRepo.findById(id).orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Application not found"));

		current.setDescription(application.getDescription());
		return appRepo.save(current);
	}

	@DeleteMapping("/{id}")
	public void deleteApp(Authentication auth, @PathVariable int id) {
		User user = (User) auth.getPrincipal();
		if (user.getRole() != User.Role.ADMIN)
			throw new APIException(HttpStatus.FORBIDDEN, "You are not allowed to access this resource");

		appService.deleteApplication(id);
	}

	public static final class CreateApplicationBody {
		public String description;
		public List<Integer> allowedUsers;
	}
}
