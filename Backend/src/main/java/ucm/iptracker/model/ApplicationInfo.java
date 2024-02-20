package ucm.iptracker.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NonNull;
import lombok.ToString;

import java.util.List;


@Entity
@Table(name = "application_info")
@ToString
@Getter
public class ApplicationInfo extends Auditable<String> { // TODO: User UID instead of id??
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	@Column(name = "app_info_uid", updatable = false)
	private int id;

	@Column(name = "app_info_description")
	private String description;

	@OneToMany(mappedBy = "appInfoId")
	@NonNull
	private List<ServerInfo> servers;


	public void setDescription(@NonNull String description) {
		if (description.length() != 3) throw new IllegalArgumentException("Description must be 3 characters long");
		this.description = description;
	}
}
