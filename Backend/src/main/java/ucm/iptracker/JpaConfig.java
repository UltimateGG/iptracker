package ucm.iptracker;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.util.Optional;


@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class JpaConfig {
	@Bean
	public AuditorAware<String> auditorAware() {
		return new AuditorAwareImpl();
	}

	// Used in db auditing for the columns createdBy and modifiedBy
	public static class AuditorAwareImpl implements AuditorAware<String> {
		@Override
		public Optional<String> getCurrentAuditor() {
			return Optional.of("TestUsr");
			// Can use Spring Security to return currently logged in user
			// return ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername()
		}
	}
}
