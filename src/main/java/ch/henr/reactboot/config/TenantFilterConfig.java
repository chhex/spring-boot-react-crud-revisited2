package ch.henr.reactboot.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;

@Configuration
public class TenantFilterConfig {

  @Bean
  public FilterRegistrationBean<TenantFilter> tenantFilterRegistration(TenantFilter filter) {
    var reg = new FilterRegistrationBean<>(filter);
    reg.setName("tenantFilter");
    reg.setOrder(Ordered.LOWEST_PRECEDENCE - 10);
    reg.addUrlPatterns("/api/clients/*", "/api/tenantInfo");    
    return reg;
  }
}