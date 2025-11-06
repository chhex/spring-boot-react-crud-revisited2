package ch.henr.reactboot.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonClassDescription;
import com.fasterxml.jackson.annotation.JsonInclude;

import ch.henr.reactboot.db.ClientRepository;

import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping("/tenantInfo")
public class TenantController {

    record TenantInfo(String tenantDisplay, long clientCount) {
    }

    private final ClientRepository repo;

    public TenantController(ClientRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public TenantInfo info(HttpSession session) {
        String display = (String) session.getAttribute("tenantDisplay");
        Instant createdAt = (Instant) session.getAttribute("tenantCreated");

        if (display == null) {
            display = UUID.randomUUID().toString().substring(0, 8);
            createdAt = Instant.now();
            session.setAttribute("tenantDisplay", display);
            session.setAttribute("tenantCreated", createdAt);
        }
        long count = repo.count(); // total clients for this tenant/session
        return new TenantInfo(display, count);
    }
}