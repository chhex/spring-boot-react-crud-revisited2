package ch.henr.reactboot.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name="clients",
  uniqueConstraints = {
    @UniqueConstraint(name="uk_clients_tenant_email", columnNames={"tenant_id","email"}),
    @UniqueConstraint(name="uk_clients_tenant_name",  columnNames={"tenant_id","name"})
  }
)public class Client {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private String email;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    public Client() {
    }

    public Client(Long id, String name, String email, Tenant tenant) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.tenant = tenant;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Tenant getTenant() {
        return tenant;
    }

    public void setTenant(Tenant tenant) {
        this.tenant = tenant;
    }

    @Override
    public String toString() {
        return "Client [id=" + id + ", name=" + name + ", email=" + email + ", tenant=" + tenant + "]";
    }
    
}
