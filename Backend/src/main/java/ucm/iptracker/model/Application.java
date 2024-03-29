package ucm.iptracker.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NonNull;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;


@Entity
@Table(name = "application_info")
@ToString
@Getter
public class Application extends Auditable<String> {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	@Column(name = "app_info_uid")
	private int id;

	@Column(name = "app_info_description", length = 3, nullable = false)
	@NonNull
	private String description;

	@OneToMany(mappedBy = "appInfoId", fetch = FetchType.EAGER)
	@NonNull
	private Set<Server> servers = new HashSet<>();


	public void setDescription(@NonNull String description) {
		if (description.length() != 3) throw new IllegalArgumentException("Description must be 3 characters long");
		this.description = description;
	}
}
