package ch.henr.reactboot.controller;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    ProblemDetail handleDataIntegrity(DataIntegrityViolationException ex) {

        if (ex.getMostSpecificCause().getMessage().contains("UK_CLIENTS_TENANT_EMAIL")) {
            ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.CONFLICT);
            pd.setDetail("Email already exists");
            pd.setProperty("code", "EMAIL_ALREADY_EXISTS");
            pd.setProperty("field", "email");
            return pd;
        }
        if (ex.getMostSpecificCause().getMessage().contains("UK_CLIENTS_TENANT_NAME")) {
            ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.CONFLICT);
            pd.setDetail("Name already exists");
            pd.setProperty("code", "NAME_ALREADY_EXISTS");
            pd.setProperty("field", "name");
            return pd;
        }

        // fallback
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        pd.setDetail("Data integrity violation");
        return pd;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {

        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        pd.setTitle("Validation failed");
        pd.setDetail("One or more fields are invalid");
        pd.setProperty("code", "VALIDATION_ERROR");

        List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();

        // Provide structured per-field errors
        var errors = fieldErrors.stream().map(fe -> new FieldViolation(
                fe.getField(),
                fe.getDefaultMessage())).toList();

        pd.setProperty("errors", errors);

        return pd;
    }

      public record FieldViolation(String field, String message) {}

}
