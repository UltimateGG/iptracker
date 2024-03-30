package ucm.iptracker.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ucm.iptracker.model.Application;
import ucm.iptracker.model.User;
import ucm.iptracker.model.UserAppLink;
import ucm.iptracker.repository.ApplicationRepo;
import ucm.iptracker.repository.UserAppsRepo;
import ucm.iptracker.repository.UserRepo;

import java.util.List;


@Service
public class UserService implements UserDetailsService {
	private final UserAppsRepo userAppsRepo;
	private final UserRepo userRepo;
	private final ApplicationRepo appRepo;


	@Autowired
	public UserService(UserAppsRepo userAppsRepo, UserRepo userRepo, ApplicationRepo appRepo) {
		this.userAppsRepo = userAppsRepo;
		this.userRepo = userRepo;
		this.appRepo = appRepo;
	}

	public List<Application> getAllowedApplications(int userId) {
		User user = userRepo.findById(userId)
				.orElseThrow(() -> new EntityNotFoundException("User not found"));

		// Admins can see all applications, users can only see theirs
		if (user.getRole() == User.Role.ADMIN) return appRepo.findAll();

		List<UserAppLink> appIds = userAppsRepo.findAllByUserId(user.getId());
		return appRepo.findAllById(appIds.stream().map(UserAppLink::getApplicationId).toList());
	}

	@Transactional
	private void addUserToApplication(int userId, int applicationId) {
		User user = userRepo.findById(userId)
				.orElseThrow(() -> new EntityNotFoundException("User not found"));

		Application application = appRepo.findById(applicationId)
				.orElseThrow(() -> new EntityNotFoundException("Application not found"));

		UserAppLink linkedApp = userAppsRepo.findByUserIdAndApplicationId(userId, applicationId);
		if (linkedApp != null)
			throw new IllegalStateException("User already has access to this application");

		UserAppLink userAppLink = new UserAppLink(user.getId(), application.getId());
		userAppsRepo.save(userAppLink);
	}

	@Transactional
	private void removeUserFromApplication(int userId, int applicationId) {
		UserAppLink linkedApp = userAppsRepo.findByUserIdAndApplicationId(userId, applicationId);
		if (linkedApp == null)
			throw new IllegalStateException("User does not have access to this application");

		userAppsRepo.delete(linkedApp);
	}

	@Transactional
	public void setUserApplications(int userId, List<Integer> applicationIds) {
		List<UserAppLink> linkedApps = userAppsRepo.findAllByUserId(userId);

		for (UserAppLink linkedApp : linkedApps) {
			if (!applicationIds.contains(linkedApp.getApplicationId()))
				removeUserFromApplication(userId, linkedApp.getApplicationId());
		}

		for (int appId : applicationIds) {
			if (linkedApps.stream().noneMatch(linkedApp -> linkedApp.getApplicationId() == appId))
				addUserToApplication(userId, appId);
		}
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepo.findByUsername(username);

		if (user == null) throw new UsernameNotFoundException("User not found");
		return user;
	}

	public boolean usernameAvailable(String username) {
		return userRepo.findByUsername(username) == null;
	}

	@Transactional
	public void deleteUser(int id) {
		// delete all app links so foreign key constraint doesn't fail
		userAppsRepo.deleteAllByUserId(id);
		userRepo.deleteById(id);
	}
}
