package ucm.iptracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ucm.iptracker.model.User;


@Repository
public interface UserRepo extends JpaRepository<User, Integer> {

}
