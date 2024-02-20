package ucm.iptracker.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.ToString;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@ToString
@Getter
public abstract class Auditable<U> {
	@CreatedDate
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "created_at", nullable = false, updatable = false)
	protected Date createdAt;

	@CreatedBy
	@Column(name = "created_by", nullable = false, updatable = false)
	protected U createdBy;

	@LastModifiedDate
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "modified_at")
	protected Date modifiedAt;

	@LastModifiedBy
	@Column(name = "modified_by")
	protected U modifiedBy;
}
