package ucm.iptracker.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ucm.iptracker.model.ApplicationInfo;


@Repository
public interface ApplicationInfoRepo extends JpaRepository<ApplicationInfo, Integer> {

}
