package ucm.iptracker.model;


import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Entity
@Table(name = "server_info")
@ToString
@Getter
@Setter
public class ServerInfo extends Auditable<String> {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	@Column(name = "server_info_uid", updatable = false)
	@Setter(AccessLevel.NONE)
	private int id;

	@ManyToOne
	@JoinColumn(name = "app_info_uid")
	@Setter(AccessLevel.NONE)
	private ApplicationInfo appInfoId;

	@Column(name = "source_hostname")
	private String sourceHostname;

	@Column(name = "source_ip_address")
	private String sourceIpAddress;

	@Column(name = "destination_hostname")
	private String destinationHostname;

	@Column(name = "destination_ip_address")
	private String destinationIpAddress;

	@Column(name = "destination_port")
	private int destinationPort;

	@Column(name = "ip_status")
	private String ipStatus; // TODO: Enum,bool?
}
