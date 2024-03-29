package ucm.iptracker.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ucm.iptracker.model.Application;


@Repository
public interface ApplicationRepo extends JpaRepository<Application, Integer> {

}
