package ch.henr.reactboot.db;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ch.henr.reactboot.entity.Client;
import ch.henr.reactboot.entity.Tenant;
public interface ClientsRepository extends JpaRepository<Client, Long> {
  @Query("select c from Client c where c.tenant = :t")
  List<Client> findAllByTenant(@Param("t") Tenant tenant);

  @Query("select c from Client c where c.tenant = :t and c.id = :id")
  Optional<Client> findByTenantAndId(@Param("t") Tenant t, @Param("id") Long id);

  @Query("select count(c) from Client c where c.tenant = :t")
  long countByTenant(@Param("t") Tenant tenant);
}