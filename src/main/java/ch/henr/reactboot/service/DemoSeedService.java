// service/DemoSeedService.java
package ch.henr.reactboot.service;

import ch.henr.reactboot.entity.Client;
import ch.henr.reactboot.entity.Tenant;
import ch.henr.reactboot.db.ClientsRepository;
import ch.henr.reactboot.db.TenantRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
//@Profile({"dev","prod"}) // for the moment also in prod
public class DemoSeedService {
  private final ClientsRepository clients;
  private final TenantRepository tenants;

 
  public DemoSeedService(ClientsRepository clients, TenantRepository tenants) {
    this.clients = clients; this.tenants = tenants;
  }

  @Transactional
  public void seedOnce(Tenant t) {
    if (t.isDemoSeeded()) return;
    clients.saveAll(List.of(
      new Client(null, "First Example Client",  "first@example.com",  t),
      new Client(null, "Second Example Client", "second@example.com", t)
    ));
    t.setDemoSeeded(true);
    tenants.save(t);
  }
}