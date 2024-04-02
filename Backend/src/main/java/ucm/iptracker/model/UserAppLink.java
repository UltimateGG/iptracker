package ucm.iptracker.model;


import jakarta.persistence.*;
import lombok.Getter;


// Relational table
@Entity
@Table(name = "user_apps")
@Getter
public class UserAppLink extends Auditable<String> {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	@Column(name = "user_apps_uid")
	private int id;

	@Column(name = "user_uid", nullable = false)
	private int userId;

	@Column(name = "app_info_uid", nullable = false)
	private int applicationId;


	public UserAppLink(int userId, int applicationId) {
		this.userId = userId;
		this.applicationId = applicationId;
	}

	protected UserAppLink() { }
}
