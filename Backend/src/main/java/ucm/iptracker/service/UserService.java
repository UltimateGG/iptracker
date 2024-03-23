package ucm.iptracker.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ucm.iptracker.model.ApplicationInfo;
import ucm.iptracker.model.User;
import ucm.iptracker.model.UserApps;
import ucm.iptracker.repository.ApplicationInfoRepo;
import ucm.iptracker.repository.UserAppsRepo;
import ucm.iptracker.repository.UserRepo;


@Service
public class UserService implements UserDetailsService {
	private final UserAppsRepo userAppsRepo;
	private final UserRepo userRepo;
	private final ApplicationInfoRepo appInfoRepo;


	@Autowired
	public UserService(UserAppsRepo userAppsRepo, UserRepo userRepo, ApplicationInfoRepo appInfoRepo) {
		this.userAppsRepo = userAppsRepo;
		this.userRepo = userRepo;
		this.appInfoRepo = appInfoRepo;
	}

	@Transactional
	public void addUserToApplication(int userId, int applicationId) {
		User user = userRepo.findById(userId)
				.orElseThrow(() -> new EntityNotFoundException("User not found"));

		ApplicationInfo applicationInfo = appInfoRepo.findById(applicationId)
				.orElseThrow(() -> new EntityNotFoundException("Application not found"));

		if (user.getApps().stream().anyMatch(ua -> ua.getId() == applicationId))
			throw new IllegalStateException("User already has access to this application");

		UserApps userApps = new UserApps(user, applicationInfo);
		userAppsRepo.save(userApps);
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepo.findByUsername(username);

		if (user == null) throw new UsernameNotFoundException("User not found");
		return user;
	}
}
