package ucm.iptracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ucm.iptracker.APIException;
import ucm.iptracker.model.Server;
import ucm.iptracker.model.User;
import ucm.iptracker.repository.ServerRepo;

@RestController
@RequestMapping("/servers")

public class ServerController {
    private final ServerRepo serverRepo;

    @Autowired
    public ServerController(ServerRepo serverRepo){
        this.serverRepo = serverRepo;
    }
    @PostMapping
    public Server createServer(Authentication auth, @RequestBody Server server) {
        User currentUser = (User) auth.getPrincipal();

        // Only users can create servers
        if (currentUser.getRole() != User.Role.USER)
            throw new APIException(HttpStatus.FORBIDDEN, "You are not allowed to create servers");


        return serverRepo.save(server);
    }

    @PutMapping("/{id}")
    public Server updateServer(Authentication auth, @PathVariable int id, @RequestBody Server server) {
        User currentUser = (User) auth.getPrincipal();

        // Only admins can update users
        if (currentUser.getRole() != User.Role.USER)
            throw new APIException(HttpStatus.FORBIDDEN, "You are not allowed to update servers");

        Server serverToUpdate = serverRepo.findById(id).orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Server not found"));

        return serverRepo.save(server);
    }
}
