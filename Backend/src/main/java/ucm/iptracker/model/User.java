package ucm.iptracker.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NonNull;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;


@Entity
@Table(name = "`user`") // Backticks needed because user is a reserved keyword
@ToString
@Getter
public class User extends Auditable<String> implements UserDetails {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	@Column(name = "user_uid")
	private int id;

	@Column(name = "user_id", nullable = false)
	private String username;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@Column(name = "user_password", nullable = false)
	private String password;

	@Column(name = "user_role", nullable = false)
	@Enumerated(EnumType.ORDINAL)
	private Role role;


	public void setUsername(@NonNull String username) {
		if (username.length() < 3 || username.length() > 32)
			throw new IllegalArgumentException("Username must be between 3 and 32 characters long");

		this.username = username;
	}

	public void setPassword(@NonNull String password) {
		if (password.length() < 6 || password.length() > 32)
			throw new IllegalArgumentException("Password must be between 6 and 32 characters long");

		this.password = password;
	}

	public void setRole(@NonNull Role role) {
		this.role = role;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority(role.name()));
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}


	public enum Role {
		USER, ADMIN;

		@JsonValue
		public int toJson() {
			return this.ordinal();
		}
	}
}
