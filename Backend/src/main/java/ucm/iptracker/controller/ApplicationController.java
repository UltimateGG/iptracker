package ucm.iptracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ucm.iptracker.model.Application;
import ucm.iptracker.model.User;
import ucm.iptracker.service.UserService;

import java.util.List;


@RestController
@RequestMapping("/apps")
public class ApplicationController {
	private final UserService userService;

	@Autowired
	public ApplicationController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping
	public List<Application> getAllApps(Authentication auth) {
		User user = (User) auth.getPrincipal();

		return userService.getAllowedApplications(user.getId());
	}
}
