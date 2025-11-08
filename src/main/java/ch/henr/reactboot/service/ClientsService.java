package ch.henr.reactboot.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ch.henr.reactboot.db.ClientsRepository;
import ch.henr.reactboot.dto.ClientUpsertDto;
import ch.henr.reactboot.entity.Client;
import ch.henr.reactboot.mapper.ClientMapper;
import ch.henr.reactboot.support.TenantHolder;

@Service
public class ClientsService {
    private final ClientsRepository repo;
    private final ClientMapper mapper;

    public ClientsService(ClientsRepository repo, ClientMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<Client> list() {
        return repo.findAllByTenant(TenantHolder.get());
    }

    @Transactional(readOnly = true)
    public Client get(Long id) {
        return repo.findByTenantAndId(TenantHolder.get(), id).orElseThrow();
    }

    @Transactional
    public Client create(ClientUpsertDto in) {
        var c = new Client();
        mapper.updateEntityFromDto(in, c);
        c.setTenant(TenantHolder.get());
        return repo.save(c);
    }

    @Transactional
    public Client update(Long id, ClientUpsertDto in) {
        var c = repo.findByTenantAndId(TenantHolder.get(), id).orElseThrow();
        mapper.updateEntityFromDto(in, c);
        return c;
    }

    @Transactional
    public void delete(Long id) {
        repo.findByTenantAndId(TenantHolder.get(), id).ifPresent(repo::delete);
    }
}