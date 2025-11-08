// dto/ClientUpsertDto.java
package ch.henr.reactboot.dto;

public record ClientUpsertDto(
        String name,
        String email) {
}