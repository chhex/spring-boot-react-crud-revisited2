package ch.henr.reactboot.config;

import java.io.IOException;
import java.time.Instant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import ch.henr.reactboot.db.TenantRepository;
import ch.henr.reactboot.entity.Tenant;
import ch.henr.reactboot.service.DemoSeedService;
import ch.henr.reactboot.support.TenantHolder;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Component
public class TenantFilter extends OncePerRequestFilter {
    private static final Logger log = LoggerFactory.getLogger(TenantFilter.class);
    @Autowired
    private final TenantRepository tenants;
    @Autowired(required = false)
    private final DemoSeedService demoSeed; // inject (present only in


    
    public TenantFilter() {
        this.tenants = null;
        this.demoSeed = null;
    }

    public TenantFilter(TenantRepository tenants) {
        this.tenants = tenants;
        this.demoSeed = null;
    }

    public TenantFilter(TenantRepository tenants, DemoSeedService demoSeed) {
        this.tenants = tenants;
        this.demoSeed = demoSeed;
    }



    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String path = req.getRequestURI();
        long t0 = System.nanoTime();
        try {
            HttpSession session = req.getSession(true);
            String token = (String) session.getAttribute("tenantToken");
            Tenant tenant;
            boolean created = false;
            if (token == null) {
                token = java.util.UUID.randomUUID().toString().substring(0, 8);
                tenant = tenants.save(new Tenant(null, token, Instant.now(), Instant.now()));
                session.setAttribute("tenantToken", token);
                session.setAttribute("tenantId", tenant.getId());
                created = true;
            } else {
                tenant = tenants.findByToken(token).orElseThrow();
                tenant.setLastSeen(Instant.now());
                tenants.save(tenant);
            }
            TenantHolder.set(tenant);
            if (created && demoSeed != null) {
                demoSeed.seedOnce(tenant);
            }
            MDC.put("tenant", tenant.getToken());
            MDC.put("path", path);
            log.debug("Tenant resolved{}: token={}, id={}",
                    created ? " (created)" : "", tenant.getToken(), tenant.getId());
            chain.doFilter(req, res);
        } finally {
            long ms = (System.nanoTime() - t0) / 1_000_000;
            log.trace("Completed {} in {} ms", path, ms);
            TenantHolder.clear();
            MDC.clear();
        }
    }
}
