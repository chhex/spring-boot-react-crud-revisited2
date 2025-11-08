// mapper/ClientMapper.java
package ch.henr.reactboot.mapper;

import ch.henr.reactboot.dto.*;
import ch.henr.reactboot.entity.Client;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ClientMapper {
    ClientDto toDto(Client entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "tenant", ignore = true)
    void updateEntityFromDto(ClientUpsertDto dto, @MappingTarget Client entity);
}
