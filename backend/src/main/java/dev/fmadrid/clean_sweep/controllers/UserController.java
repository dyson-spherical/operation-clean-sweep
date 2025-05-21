package dev.fmadrid.clean_sweep.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.fmadrid.clean_sweep.domain.User;
import dev.fmadrid.clean_sweep.domain.UserPreferences;
import dev.fmadrid.clean_sweep.services.UserService;

@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public User getCurrentUser(@AuthenticationPrincipal OidcUser oidcUser) {
        return userService.getOrCreateUser(oidcUser);
    }

    @PutMapping("/me/preferences")
    @PreAuthorize("isAuthenticated()")
    public User updatePreferences(
            @AuthenticationPrincipal OidcUser oidcUser,
            @Validated @RequestBody UserPreferences preferences) {
        // Verify the authenticated user matches the user being updated
        User user = userService.getOrCreateUser(oidcUser);
        if (!user.getEmail().equals(oidcUser.getEmail())) {
            throw new SecurityException("User can only update their own preferences");
        }
        user.setPreferences(preferences);
        return userService.save(user);
    }
}
