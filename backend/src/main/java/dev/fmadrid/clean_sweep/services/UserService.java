package dev.fmadrid.clean_sweep.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.security.oauth2.core.oidc.user.OidcUser;
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
        return userRepository.save(user);
    }

    @Transactional
    public User getOrCreateUser(OidcUser oidcUser) {
        String email = oidcUser.getEmail();
        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            updateUserFromOidc(user, oidcUser);
            return userRepository.save(user);
        } else {
            User newUser = createUserFromOidc(oidcUser);
            return userRepository.save(newUser);
        }
    }

    private User createUserFromOidc(OidcUser oidcUser) {
        return User.builder()
                .email(oidcUser.getEmail())
                .username(oidcUser.getPreferredUsername())
                .name(oidcUser.getName())
                .roles(extractRoles(oidcUser))
                .preferences(new UserPreferences())
                .balance(BigDecimal.ZERO)
                .completedChores(0)
                .streakCount(0)
                .achievements(List.of())
                .verifiableTasks(new HashSet<>())
                .lastLoginAt(LocalDateTime.now())
                .build();
    }

    private void updateUserFromOidc(User user, OidcUser oidcUser) {
        user.setUsername(oidcUser.getPreferredUsername());
        user.setName(oidcUser.getName());
        user.setRoles(extractRoles(oidcUser));
        user.setLastLoginAt(LocalDateTime.now());
    }

    private Set<Role> extractRoles(OidcUser oidcUser) {
        Set<Role> roles = new HashSet<>();
        List<String> roleClaims = oidcUser.getClaimAsStringList("roles");

        if (roleClaims != null) {
            for (String role : roleClaims) {
                try {
                    roles.add(Role.valueOf(role.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    // Skip invalid roles
                }
            }
        }

        return roles;
    }
}