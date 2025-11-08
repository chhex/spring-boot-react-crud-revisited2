package ch.henr.reactboot.entity;

import java.time.Instant;

import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
@Table(name = "tenants", indexes = {
    @Index(name = "ix_tenants_token", columnList = "token", unique = true)
})
public class Tenant {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true, length = 64)
  private String token; // opaque public id

  // entity/Tenant.java
  @Column(nullable = false)
  private boolean demoSeeded = false;

  @Column(nullable = false)
  private Instant createdAt;
  @Column(nullable = false)
  private Instant lastSeen;

  public Tenant() {
  }

  public Tenant(Long id, String token, Instant createdAt, Instant lastSeen) {
    this.id = id;
    this.token = token;
    this.createdAt = createdAt;
    this.lastSeen = lastSeen;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getToken() {
    return token;
  }

  public void setToken(String token) {
    this.token = token;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public Instant getLastSeen() {
    return lastSeen;
  }

  public void setLastSeen(Instant lastSeen) {
    this.lastSeen = lastSeen;
  }

  public boolean isDemoSeeded() {
    return demoSeeded;
  }

  public void setDemoSeeded(boolean v) {
    this.demoSeeded = v;
  }

  @Override
  public String toString() {
    return "Tenant [id=" + id + ", token=" + token + ", createdAt=" + createdAt + ", lastSeen=" + lastSeen
        + ", demoSeeded=" + demoSeeded + "]";
  }

}
