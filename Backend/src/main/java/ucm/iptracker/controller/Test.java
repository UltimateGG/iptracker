package ucm.iptracker.controller;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.function.EntityResponse;
import ucm.iptracker.APIException;
import ucm.iptracker.model.ApplicationInfo;
import ucm.iptracker.model.ServerInfo;
import ucm.iptracker.model.User;
import ucm.iptracker.repository.ApplicationInfoRepo;
import ucm.iptracker.repository.ServerInfoRepo;
import ucm.iptracker.repository.UserRepo;
import ucm.iptracker.service.UserService;


@RestController
public class Test {
	private final ApplicationInfoRepo appInfoRepo;
	private final ServerInfoRepo serverInfoRepo;
	private final UserRepo userRepo;
	private final UserService userService;


	@Autowired
	public Test(ApplicationInfoRepo appInfoRepo, ServerInfoRepo serverInfoRepo, UserService userService, UserRepo userRepo) {
		this.appInfoRepo = appInfoRepo;
		this.serverInfoRepo = serverInfoRepo;
		this.userService = userService;
		this.userRepo = userRepo;
	}

	@GetMapping("/test")
	public String test() {
//		User user = new User();
//		user.setUsername("Blake");
//		user.setPassword("password");
//		user.setRole(User.Role.ADMIN);
//
//		userRepo.save(user);
//		ApplicationInfo app = new ApplicationInfo();
//		app.setDescription("MXQ");
//
//		appInfoRepo.save(app);
//		ServerInfo serverInfo = new ServerInfo();
//		serverInfo.setAppInfoId(1);
//		serverInfo.setSourceIpAddress("42.12.244.23");
//
//		serverInfoRepo.save(serverInfo);
//		userService.addUserToApplication(1,1);

		return "Hello World!";
	}

	@GetMapping("/apps/{id}")
	public ApplicationInfo getAppInfo(@PathVariable int id) {
		return appInfoRepo.findById(id).orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Application not found"));
	}

	@GetMapping("/users/{id}")
	public User getUser(@PathVariable int id) {
		return userRepo.findById(id).orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "User not found"));
	}
}
