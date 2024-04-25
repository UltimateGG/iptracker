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

        if (server.getSourceIpAddress() == null || server.getSourceIpAddress().length() < 5 || server.getSourceIpAddress().length() > 15)
            throw new APIException(HttpStatus.BAD_REQUEST, "Invalid source IP address");
        if (server.getDestinationIpAddress() == null|| server.getDestinationIpAddress().length() < 5 || server.getDestinationIpAddress().length() > 15)
            throw new APIException(HttpStatus.BAD_REQUEST, "Invalid destination IP address");
        if (server.getDestinationPort() < 0 || server.getDestinationPort() > 65535)
            throw new APIException(HttpStatus.BAD_REQUEST, "Invalid destination port");
        if (server.getSourceHostname() == null || server.getSourceHostname().length() == 0 || server.getSourceHostname().length() > 255)
            throw new APIException(HttpStatus.BAD_REQUEST, "Invalid source hostname");
        if (server.getDestinationHostname() == null || server.getDestinationHostname().length() == 0 || server.getDestinationHostname().length() > 255)
            throw new APIException(HttpStatus.BAD_REQUEST, "Invalid destination hostname");

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

    @DeleteMapping("/{id}")
    public void deleteServer(Authentication auth, @PathVariable int id) {
        User currentUser = (User) auth.getPrincipal();

        // Only users can delete servers
        if (currentUser.getRole() != User.Role.USER)
            throw new APIException(HttpStatus.FORBIDDEN, "You are not allowed to delete servers");

        Server server = serverRepo.findById(id).orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Server not found"));

        serverRepo.delete(server);
    }
}
