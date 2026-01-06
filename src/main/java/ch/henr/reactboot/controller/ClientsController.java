package ch.henr.reactboot.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import ch.henr.reactboot.dto.ClientDto;
import ch.henr.reactboot.dto.ClientUpsertDto;
import ch.henr.reactboot.mapper.ClientMapper;
import ch.henr.reactboot.service.ClientsService;
import jakarta.validation.Valid;

@RestController
@RequestMapping(value="/api/clients", produces="application/json")
public class ClientsController {
  
  private final ClientsService service;
  private final ClientMapper mapper; 

  public ClientsController(ClientsService service, ClientMapper mapper) {
    this.service = service;
    this.mapper = mapper;
}

  @GetMapping
  public List<ClientDto> list() {
    return service.list().stream().map(mapper::toDto).toList();
  }

  @GetMapping("/{id}")
  public ClientDto get(@PathVariable Long id) {
    return mapper.toDto(service.get(id));
  }

  @PostMapping(consumes="application/json")
  @ResponseStatus(HttpStatus.CREATED)
  public ClientDto create(@Valid @RequestBody ClientUpsertDto in) {
    var entity = service.create(in);  // see below
    return mapper.toDto(entity);
  }

  @PutMapping(value="/{id}", consumes="application/json")
  public ClientDto update(@PathVariable Long id, @RequestBody ClientUpsertDto in) {
    var entity = service.update(id, in);
    return mapper.toDto(entity);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    service.delete(id);
  }
}