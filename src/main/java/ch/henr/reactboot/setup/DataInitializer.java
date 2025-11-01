package ch.henr.reactboot.setup;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import ch.henr.reactboot.db.ClientRepository;
import ch.henr.reactboot.model.Client;

@Configuration
public class DataInitializer {

  private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

  @Bean
  CommandLineRunner initDatabase(ClientRepository repo) {
    return args -> {
      log.info("DataInitializer starting, repo.count() = {}", repo.count());
      if (repo.count() == 0) {
        repo.save(new Client(null, "Pete Powerlace", "pete@math.io"));
        repo.save(new Client(null, "Grace Hopper", "grace@gmail.com"));
        repo.save(new Client(null, "Peter Mueller", "hess@schwisscom.ch"));
        log.info("✅ Loaded demo clients");
      } else {
        log.info("Skipping seed, existing rows = {}", repo.count());
      }
    };
  }


}
