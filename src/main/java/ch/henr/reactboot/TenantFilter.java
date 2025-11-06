package ch.henr.reactboot;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

// TenantFilter.java
@Component
public class TenantFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        try {
            // Always create/keep a session, derive tenant from it
            HttpSession session = req.getSession(true);
            String tenant = (String) session.getAttribute("tenantId");
            if (tenant == null) {
                tenant = "sess:" + session.getId();
                session.setAttribute("tenantId", tenant);
            }
            String display = (String) session.getAttribute("tenantDisplay");
            if (display == null) {
                display = java.util.UUID.randomUUID().toString().substring(0, 8);
                session.setAttribute("tenantDisplay", display);
            }
            TenantContext.set(tenant);
            chain.doFilter(req, res);
        } finally {
            TenantContext.clear();
        }
    }
}
