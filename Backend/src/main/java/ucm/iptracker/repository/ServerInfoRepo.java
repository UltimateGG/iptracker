package ucm.iptracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ucm.iptracker.model.ServerInfo;


@Repository
public interface ServerInfoRepo extends JpaRepository<ServerInfo, Integer> {

}
