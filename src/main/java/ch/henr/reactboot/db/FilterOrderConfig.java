package ch.henr.reactboot.db;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import ch.henr.reactboot.TenantFilter;

@Configuration
public class FilterOrderConfig {
  @Bean
  public FilterRegistrationBean<TenantFilter> tenantFilterRegistration(TenantFilter f) {
    var reg = new FilterRegistrationBean<>(f);
    reg.setOrder(0);
    return reg;
  }
}