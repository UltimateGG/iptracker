package ucm.iptracker.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ucm.iptracker.model.Application;
import ucm.iptracker.repository.ApplicationRepo;
import ucm.iptracker.repository.UserAppsRepo;

import java.util.List;


@Service
public class ApplicationService {
	private final ApplicationRepo appRepo;
	private final UserService userService;
	private final UserAppsRepo userAppsRepo;

	@Autowired
	public ApplicationService(ApplicationRepo appRepo, UserService userService, UserAppsRepo userAppsRepo) {
		this.appRepo = appRepo;
		this.userService = userService;
		this.userAppsRepo = userAppsRepo;
	}

	@Transactional
	public Application createApplication(String description, List<Integer> allowedUsers) {
		Application newApp = new Application();
		newApp.setDescription(description);

		Application savedApp = appRepo.save(newApp);

		for (int userId : allowedUsers)
			userService.addUserToApplication(userId, savedApp.getId());

		return savedApp;
	}

	@Transactional
	public void deleteApplication(int id) {
		userAppsRepo.deleteAllByApplicationId(id);
		appRepo.deleteById(id);
	}
}
