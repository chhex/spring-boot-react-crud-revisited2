package ch.henr.reactboot.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ch.henr.reactboot.db.ClientsRepository;
import ch.henr.reactboot.entity.Tenant;
import ch.henr.reactboot.support.TenantHolder;

@RestController
@RequestMapping(value="/api/tenantInfo", produces="application/json")
public class TenantController {
  record TenantInfo(String tenantDisplay, long clientCount) {}

  private final ClientsRepository clients;

  public TenantController(ClientsRepository clients){ this.clients = clients; }

  @GetMapping
  public TenantInfo info() {
    Tenant t = TenantHolder.get();
    long count = clients.countByTenant(t);
    return new TenantInfo(t.getToken(), count);
  }
}