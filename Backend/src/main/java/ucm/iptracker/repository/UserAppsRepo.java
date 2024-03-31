package ucm.iptracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ucm.iptracker.model.UserAppLink;

import java.util.List;


@Repository
public interface UserAppsRepo extends JpaRepository<UserAppLink, Integer> {
	List<UserAppLink> findAllByUserId(int id);

	UserAppLink findByUserIdAndApplicationId(int userId, int applicationId);

	void deleteAllByUserId(int userId);

	void deleteAllByApplicationId(int applicationId);
}

