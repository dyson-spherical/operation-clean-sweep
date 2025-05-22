package dev.fmadrid.clean_sweep.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.fmadrid.clean_sweep.domain.Role;
import dev.fmadrid.clean_sweep.domain.User;
import dev.fmadrid.clean_sweep.domain.UserPreferences;
import dev.fmadrid.clean_sweep.repositories.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User save(User user) {
        try {
            return userRepository.save(user);
        } catch (DuplicateKeyException e) {
            return userRepository.findByEmail(user.getEmail())
                    .orElseThrow(() -> e);
        }
    }

    @Transactional
    public User getOrCreateUser(Jwt jwt) {
        String email = getRequiredClaim(jwt, "email");
        return userRepository.findByEmail(email)
                .map(user -> updateExistingUser(user, jwt))
                .orElseGet(() -> createNewUser(jwt));
    }

    private User updateExistingUser(User user, Jwt jwt) {
        updateUserFromJwt(user, jwt);
        return save(user);
    }

    private User createNewUser(Jwt jwt) {
        return save(createUserFromJwt(jwt));
    }

    private User createUserFromJwt(Jwt jwt) {
        String email = getRequiredClaim(jwt, "email");
        String username = getClaimOrDefault(jwt, "preferred_username", email);
        String name = getClaimOrDefault(jwt, "name", email);

        return User.builder()
                .email(email)
                .username(username)
                .name(name)
                .roles(extractRoles(jwt))
                .preferences(new UserPreferences())
                .balance(BigDecimal.ZERO)
                .completedChores(0)
                .streakCount(0)
                .achievements(List.of())
                .verifiableTasks(new HashSet<>())
                .lastLoginAt(LocalDateTime.now())
                .build();
    }

    private void updateUserFromJwt(User user, Jwt jwt) {
        getClaimIfPresent(jwt, "preferred_username").ifPresent(user::setUsername);
        getClaimIfPresent(jwt, "name").ifPresent(user::setName);
        user.setRoles(extractRoles(jwt));
        user.setLastLoginAt(LocalDateTime.now());
    }

    private Set<Role> extractRoles(Jwt jwt) {
        Set<Role> roles = new HashSet<>();
        List<String> groups = jwt.getClaimAsStringList("groups");
        List<String> entitlements = jwt.getClaimAsStringList("entitlements");
        groups.addAll(entitlements);
        if (groups != null) {
            for (String group : groups) {
                try {
                    roles.add(Role.valueOf(group.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    // Skip invalid roles
                }
            }
        }

        return roles;
    }

    private String getRequiredClaim(Jwt jwt, String claim) {
        String value = jwt.getClaimAsString(claim);
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(claim + " is required in JWT token");
        }
        return value;
    }

    private String getClaimOrDefault(Jwt jwt, String claim, String defaultValue) {
        String value = jwt.getClaimAsString(claim);
        return (value != null && !value.isBlank()) ? value : defaultValue;
    }

    private Optional<String> getClaimIfPresent(Jwt jwt, String claim) {
        String value = jwt.getClaimAsString(claim);
        return (value != null && !value.isBlank()) ? Optional.of(value) : Optional.empty();
    }
}