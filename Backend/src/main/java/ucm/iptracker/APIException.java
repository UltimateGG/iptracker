package ucm.iptracker;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;


public class APIException extends RuntimeException {
	@Getter
	@Setter
	private HttpStatus status;


	public APIException(HttpStatus status, String message) {
		super(message);
		this.status = status;
	}

	public APIException(HttpStatus status, Throwable cause) {
		super(cause);
		this.status = status;
	}

	public APIException(String message) {
		super(message);
		this.status = HttpStatus.INTERNAL_SERVER_ERROR;
	}

	public APIException(Throwable cause) {
		super(cause);
		this.status = HttpStatus.INTERNAL_SERVER_ERROR;
	}
}
