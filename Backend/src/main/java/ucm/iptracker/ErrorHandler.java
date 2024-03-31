package ucm.iptracker;


import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;


@ControllerAdvice
public class ErrorHandler {
	// Wrap all/general exceptions to json response client expects
	@ExceptionHandler(Exception.class)
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	@ResponseBody
	public JsonError handleInternalServerError(Exception ex) {
		return new JsonError(HttpStatus.INTERNAL_SERVER_ERROR.value(), ex.getMessage());
	}

	// Wrap our custom APIException to json response client expects
	@ExceptionHandler(APIException.class)
	public ResponseEntity<JsonError> handleAPIException(APIException ex) {
		JsonError jsonError = new JsonError(ex.getStatus().value(), ex.getMessage());
		return new ResponseEntity<>(jsonError, ex.getStatus());
	}

	@Data
	private static class JsonError {
		private final boolean error = true;
		private final int status;
		private final String message;

		public JsonError(int status, String message) {
			this.status = status;
			this.message = message.replace("JSON parse error: ", "");
		}
	}
}
