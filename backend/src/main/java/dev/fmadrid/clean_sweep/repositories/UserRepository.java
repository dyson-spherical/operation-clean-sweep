package dev.fmadrid.clean_sweep.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import dev.fmadrid.clean_sweep.domain.ChoreType;
import dev.fmadrid.clean_sweep.domain.Role;
import dev.fmadrid.clean_sweep.domain.User;

@RepositoryRestResource(collectionResourceRel = "users", path = "users")
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);

    List<User> findByRolesContaining(Role role);

    List<User> findByVerifiableTasksContaining(ChoreType type);

    Optional<User> findByEmail(String email);
}
