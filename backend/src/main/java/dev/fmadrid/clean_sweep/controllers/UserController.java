package dev.fmadrid.clean_sweep.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
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
@RequestMapping("/users")
@Validated
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;
    private final RepresentationModelAssembler<User, EntityModel<User>> userModelAssembler;

    public UserController(UserService userService,
            RepresentationModelAssembler<User, EntityModel<User>> userModelAssembler) {
        this.userService = userService;
        this.userModelAssembler = userModelAssembler;
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public EntityModel<User> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        logger.info("Getting current user for JWT: {}", jwt.getSubject());
        User user = userService.getOrCreateUser(jwt);
        EntityModel<User> model = userModelAssembler.toModel(user);
        logger.info("Returning user model: {}", model);
        return model;
    }

    @PutMapping("/me/preferences")
    @PreAuthorize("isAuthenticated()")
    public EntityModel<User> updatePreferences(
            @AuthenticationPrincipal Jwt jwt,
            @Validated @RequestBody UserPreferences preferences) {
        logger.info("Updating preferences for user: {}", jwt.getSubject());
        // Verify the authenticated user matches the user being updated
        User user = userService.getOrCreateUser(jwt);
        if (!user.getEmail().equals(jwt.getClaimAsString("email"))) {
            throw new SecurityException("User can only update their own preferences");
        }
        user.setPreferences(preferences);
        User updatedUser = userService.save(user);
        EntityModel<User> model = userModelAssembler.toModel(updatedUser);
        logger.info("Returning updated user model: {}", model);
        return model;
    }
}
