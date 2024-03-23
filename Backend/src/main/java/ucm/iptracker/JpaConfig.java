package ucm.iptracker;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.context.SecurityContextHolder;
import ucm.iptracker.model.User;

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
			return Optional.ofNullable(((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		}
	}
}
