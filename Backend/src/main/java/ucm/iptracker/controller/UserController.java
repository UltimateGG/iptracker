package ucm.iptracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
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
	private final UserService userService;


	@Autowired
	public UserController(UserRepo userRepo, UserAppsRepo userAppsRepo, UserService userService) {
		this.userRepo = userRepo;
		this.userAppsRepo = userAppsRepo;
		this.userService = userService;
	}

	@GetMapping
	public List<User> getAllUsers(Authentication auth) {
		User user = (User) auth.getPrincipal();

		// Only admins can view all users
		if (user.getRole() != User.Role.ADMIN)
			throw new APIException(HttpStatus.FORBIDDEN, "You are not allowed to view all users");

		return userRepo.findAll();
	}

	@GetMapping("/username-available")
	public boolean usernameAvailable(Authentication auth, @RequestParam String username) {
		User user = (User) auth.getPrincipal();
		if (user.getRole() != User.Role.ADMIN)
			throw new APIException(HttpStatus.FORBIDDEN, "You are not allowed to access this resource");

		return userService.usernameAvailable(username);
	}

	@GetMapping("/{id}")
	public User getUser(Authentication auth, @PathVariable int id) {
		User user = (User) auth.getPrincipal();

		// If the user is not an admin, they can only view their own profile
		if (user.getId() != id && user.getRole() != User.Role.ADMIN)
			throw new APIException(HttpStatus.FORBIDDEN, "You are not allowed to view this user");

		return userRepo.findById(id).orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "User not found"));
	}

	@GetMapping("/{id}/apps")
	public List<Application> getUsersApps(Authentication auth, @PathVariable int id) {
		User user = (User) auth.getPrincipal();

		if (user.getId() == id || user.getRole() == User.Role.ADMIN)
			return userAppsRepo.findAllByUser_Id(id).stream().map(UserApps::getApplication).toList();

		throw new APIException(HttpStatus.FORBIDDEN, "You are not allowed to view this user's apps");
	}

	@PostMapping
	public User createUser(Authentication auth, @RequestBody User user) {
		User currentUser = (User) auth.getPrincipal();

		// Only admins can create users
		if (currentUser.getRole() != User.Role.ADMIN)
			throw new APIException(HttpStatus.FORBIDDEN, "You are not allowed to create users");

		if (!userService.usernameAvailable(user.getUsername()))
			throw new APIException(HttpStatus.BAD_REQUEST, "Username is already taken");

		return userRepo.save(user);
	}

	@PutMapping("/{id}")
	public User updateUser(Authentication auth, @PathVariable int id, @RequestBody User user) {
		User currentUser = (User) auth.getPrincipal();

		// Only admins can update users
		if (currentUser.getRole() != User.Role.ADMIN)
			throw new APIException(HttpStatus.FORBIDDEN, "You are not allowed to update users");

		User userToUpdate = userRepo.findById(id).orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "User not found"));

		// If the username is being changed, check if it is available
		if (!userToUpdate.getUsername().equals(user.getUsername()) && !userService.usernameAvailable(user.getUsername()))
			throw new APIException(HttpStatus.BAD_REQUEST, "Username is already taken");

		userToUpdate.setUsername(user.getUsername());
		userToUpdate.setRole(user.getRole());
		if (user.getPassword() != null) userToUpdate.setPassword(user.getPassword());

		return userRepo.save(userToUpdate);
	}

	@DeleteMapping("/{id}")
	public void deleteUser(Authentication auth, @PathVariable int id) {
		User user = (User) auth.getPrincipal();

		// Only admins can delete users
		if (user.getRole() != User.Role.ADMIN)
			throw new APIException(HttpStatus.FORBIDDEN, "You are not allowed to delete users");

		if (user.getId() == id)
			throw new APIException(HttpStatus.FORBIDDEN, "You cannot delete yourself");

		User userToDelete = userRepo.findById(id).orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "User not found"));
		userRepo.delete(userToDelete);
	}
}
