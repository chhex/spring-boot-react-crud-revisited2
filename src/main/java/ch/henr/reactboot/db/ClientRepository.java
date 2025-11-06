package ch.henr.reactboot.db;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ch.henr.reactboot.model.Client;
public interface ClientRepository extends JpaRepository<Client, Long> {
  @Query("select c from Client c where c.tenantId = :tenant")
  List<Client> findAllByTenant(@Param("tenant") String tenant);

  @Query("select c from Client c where c.tenantId = :tenant and c.id = :id")
  Optional<Client> findByTenantAndId(@Param("tenant") String tenant, @Param("id") Long id);
}