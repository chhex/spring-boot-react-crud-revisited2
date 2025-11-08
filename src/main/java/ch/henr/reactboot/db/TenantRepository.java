package ch.henr.reactboot.db;

import java.time.Instant;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ch.henr.reactboot.entity.Tenant;
import jakarta.transaction.Transactional;

public interface TenantRepository extends JpaRepository<Tenant, Long> {
    Optional<Tenant> findByToken(String token);

    @Modifying
    @Transactional
    @Query("delete from Tenant t where t.lastSeen < :cutoff")
    int deleteByLastSeenBefore(@Param("cutoff") Instant cutoff);
}
