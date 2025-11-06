package ch.henr.reactboot.service;

import java.util.List;

import org.springframework.stereotype.Service;

import ch.henr.reactboot.TenantContext;
import ch.henr.reactboot.db.ClientRepository;
import ch.henr.reactboot.model.Client;

@Service
public class ClientsServiceImpl implements ClientsService {

  private final ClientRepository repo;

  public ClientsServiceImpl(ClientRepository repo){ this.repo = repo; }

  public List<Client> list() {
    return repo.findAllByTenant(TenantContext.get());
  }

  public Client findById(Long id) {
    return repo.findByTenantAndId(TenantContext.get(), id).orElseThrow();
  }

  public Client save(Client c) {
    c.setTenantId(TenantContext.get());
    return repo.save(c);
  }

  public Void delete(Long id) {
    var c = findById(id); // validates tenant
    repo.delete(c);
    return null;
  }
}
