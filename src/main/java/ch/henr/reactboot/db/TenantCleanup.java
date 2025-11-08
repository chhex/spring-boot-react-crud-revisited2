package ch.henr.reactboot.db;

import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import jakarta.transaction.Transactional;

@Component
public class TenantCleanup implements ApplicationListener<org.springframework.session.events.SessionDestroyedEvent> {
  private final TenantRepository tenants;
  public TenantCleanup(TenantRepository tenants){ this.tenants = tenants; }

  @Override
  @Transactional
  public void onApplicationEvent(org.springframework.session.events.SessionDestroyedEvent e) {
    // If you stored tenantId in the session:
    Object id = e.getSession().getAttribute("tenantId");
    if (id instanceof Long tid) {
      tenants.deleteById(tid); // cascades delete clients (ON DELETE CASCADE)
    }
  }
}