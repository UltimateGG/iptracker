package ucm.iptracker.model;


import jakarta.persistence.*;
import lombok.Getter;


// Relational table
@Entity
@Table(name = "user_apps")
@Getter
public class UserApps extends Auditable<String> {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	@Column(name = "user_apps_uid")
	private int id;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "user_uid", nullable = false)
	private User user;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "app_info_uid", nullable = false)
	private Application application;


	public UserApps(User user, Application application) {
		this.user = user;
		this.application = application;
	}

	protected UserApps() { }
}
