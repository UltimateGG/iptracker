package ucm.iptracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ucm.iptracker.model.UserApps;

import java.util.List;


@Repository
public interface UserAppsRepo extends JpaRepository<UserApps, Integer> {
	List<UserApps> findAllByUser_Id(int id);
}

