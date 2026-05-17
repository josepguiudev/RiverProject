package com.equipo.backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.equipo.backend.model.Client;
import com.equipo.backend.repository.ClientRepository;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "*")
public class ClientController {

    private final ClientRepository clientRepository;

    public ClientController(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    /**
     * Obtener un cliente por su ID de la BD.
     * Ruta: GET /api/clients/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Client> getById(@PathVariable Long id) {
        return clientRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Actualizar los datos de un cliente existente.
     * Ruta: PUT /api/clients/{id}
     * 
     * Campos que se pueden actualizar: nombre, email, cuentaBancaria.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateClient(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        return clientRepository.findById(id)
                .map(client -> {
                    if (updates.containsKey("nombre"))
                        client.setNombre((String) updates.get("nombre"));
                    if (updates.containsKey("email"))
                        client.setEmail((String) updates.get("email"));
                    if (updates.containsKey("cuentaBancaria"))
                        client.setCuentaBancaria((String) updates.get("cuentaBancaria"));

                    clientRepository.save(client);
                    return ResponseEntity.ok(client);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
