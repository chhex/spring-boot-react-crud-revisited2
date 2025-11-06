package ch.henr.reactboot.controller;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ch.henr.reactboot.model.Client;
import ch.henr.reactboot.service.ClientsService;

@RestController
@RequestMapping(value = "/clients")
public class ClientsController {

    @Autowired
    private ClientsService clientsService;

    public ClientsController(ClientsService clientsService) {
        this.clientsService = clientsService;
    }

    @GetMapping
    public List<Client> getClients() {
        var clients = clientsService.list();
        if (clients.isEmpty()) {
            clientsService.save(new Client(null, "First Example Client", "first@example.com", null));
            clientsService.save(new Client(null, "Second Example Client", "second@example.com", null));
            clients = clientsService.list();
        }

        return clients;
    }

    @GetMapping("/{id}")
    public Client getClient(@PathVariable Long id) {
        var client = clientsService.findById(id);
        return client;
    }

    @PostMapping
    public ResponseEntity<Client> createClient(@RequestBody Client client) throws URISyntaxException {
        Client savedClient = clientsService.save(client);
        return ResponseEntity.created(new URI("/clients/" + savedClient.getId())).body(savedClient);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable Long id, @RequestBody Client client) {
        Client currentClient = clientsService.findById(id);
        currentClient.setName(client.getName());
        currentClient.setEmail(client.getEmail());
        currentClient = clientsService.save(currentClient);

        return ResponseEntity.ok(currentClient);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        clientsService.delete(id);
        return ResponseEntity.ok().build();
    }
}