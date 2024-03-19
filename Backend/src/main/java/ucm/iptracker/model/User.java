package ucm.iptracker.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NonNull;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;


@Entity
@Table(name = "`user`") // Backticks needed because user is a reserved keyword
@ToString
@Getter
public class User extends Auditable<String> {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	@Column(name = "user_uid")
	private int id;

	@Column(name = "user_id", nullable = false)
	private String username;

	@JsonIgnore
	@Column(name = "user_password", nullable = false)
	private String password;

	@Column(name = "user_role", nullable = false)
	@Enumerated(EnumType.ORDINAL)
	private Role role;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(
			name = "user_apps",
			joinColumns = @JoinColumn(name = "user_uid"),
			inverseJoinColumns = @JoinColumn(name = "app_info_uid")
	)
	private Set<ApplicationInfo> apps = new HashSet<>();

	public void setUsername(@NonNull String username) {
		if (username.length() < 3 || username.length() > 32)
			throw new IllegalArgumentException("Username must be between 3 and 32 characters long");

		this.username = username;
	}

	public void setPassword(@NonNull String password) {
		if (password.length() < 8 || password.length() > 32)
			throw new IllegalArgumentException("Password must be between 8 and 32 characters long");

		this.password = password;
	}

	public void setRole(@NonNull Role role) {
		this.role = role;
	}


	public enum Role {
		USER, ADMIN;

		@JsonValue
		public int toJson() {
			return this.ordinal();
		}
	}
}