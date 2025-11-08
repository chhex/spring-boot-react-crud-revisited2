package ch.henr.reactboot.db;

import java.time.Duration;
import java.time.Instant;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;

@Configuration
@EnableScheduling
class TenantJanitor {
  private final TenantRepository tenants;

  public TenantJanitor(TenantRepository tenants) {
    this.tenants = tenants;
  }

  @Scheduled(cron = "0 0 * * * *") // hourly
  @Transactional
  public void purgeOld() {
    Instant cutoff = Instant.now().minus(Duration.ofHours(12));
    tenants.deleteByLastSeenBefore(cutoff);
  }
}