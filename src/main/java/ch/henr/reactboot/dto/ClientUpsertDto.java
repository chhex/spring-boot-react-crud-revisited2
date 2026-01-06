// dto/ClientUpsertDto.java
package ch.henr.reactboot.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ClientUpsertDto(
        @NotBlank
        String name,
        @NotBlank
        @Email
        String email) {
}