package ucm.iptracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ucm.iptracker.model.Server;


@Repository
public interface ServerRepo extends JpaRepository<Server, Integer> {

}
