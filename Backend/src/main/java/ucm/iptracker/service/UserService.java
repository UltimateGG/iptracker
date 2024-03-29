package ucm.iptracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ucm.iptracker.model.User;
import ucm.iptracker.repository.ApplicationRepo;
import ucm.iptracker.repository.UserAppsRepo;
import ucm.iptracker.repository.UserRepo;


@Service
public class UserService implements UserDetailsService {
	private final UserAppsRepo userAppsRepo;
	private final UserRepo userRepo;
	private final ApplicationRepo appInfoRepo;


	@Autowired
	public UserService(UserAppsRepo userAppsRepo, UserRepo userRepo, ApplicationRepo appInfoRepo) {
		this.userAppsRepo = userAppsRepo;
		this.userRepo = userRepo;
		this.appInfoRepo = appInfoRepo;
	}

	/*@Transactional
	public void addUserToApplication(int userId, int applicationId) {
		User user = userRepo.findById(userId)
				.orElseThrow(() -> new EntityNotFoundException("User not found"));

		Application application = appInfoRepo.findById(applicationId)
				.orElseThrow(() -> new EntityNotFoundException("Application not found"));

		if (user.getApps().stream().anyMatch(ua -> ua.getId() == applicationId)) // TODO FIX
			throw new IllegalStateException("User already has access to this application");

		UserApps userApps = new UserApps(user, application);
		userAppsRepo.save(userApps);
	}*/

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepo.findByUsername(username);

		if (user == null) throw new UsernameNotFoundException("User not found");
		return user;
	}
}
