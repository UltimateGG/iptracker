package ucm.iptracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ucm.iptracker.model.UserApps;


@Repository
public interface UserAppsRepo extends JpaRepository<UserApps, Integer> {

}

