package ch.henr.reactboot.service;

import java.util.List;

import ch.henr.reactboot.model.Client;

public interface ClientsService {

    List<Client> list();

    Client findById(Long id);

    Client save(Client client);

    Void delete(Long id);

}