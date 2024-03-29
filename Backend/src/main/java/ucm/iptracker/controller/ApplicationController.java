package ucm.iptracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ucm.iptracker.model.Application;
import ucm.iptracker.model.User;
import ucm.iptracker.model.UserApps;
import ucm.iptracker.repository.ApplicationRepo;
import ucm.iptracker.repository.UserAppsRepo;

import java.util.List;


@RestController
@RequestMapping("/apps")
public class ApplicationController {
	private final ApplicationRepo appRepo;
	private final UserAppsRepo userAppsRepo;

	@Autowired
	public ApplicationController(ApplicationRepo appRepo, UserAppsRepo userAppsRepo) {
		this.appRepo = appRepo;
		this.userAppsRepo = userAppsRepo;
	}

	@GetMapping
	public List<Application> getAllApps(Authentication auth) {
		User user = (User) auth.getPrincipal();

		// Admins can see all applications, users can see theirs
		if (user.getRole() == User.Role.ADMIN) return appRepo.findAll();

		// Get all applications that the user has access to
		return userAppsRepo.findAllByUser_Id(user.getId()).stream().map(UserApps::getApplication).toList();
	}
}
