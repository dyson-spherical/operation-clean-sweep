package dev.fmadrid.clean_sweep.assemblers;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import dev.fmadrid.clean_sweep.controllers.UserController;
import dev.fmadrid.clean_sweep.domain.User;

@Component
public class UserModelAssembler implements RepresentationModelAssembler<User, EntityModel<User>> {

    @Override
    public EntityModel<User> toModel(User user) {
        return EntityModel.of(user,
                linkTo(methodOn(UserController.class).getCurrentUser(null)).withSelfRel(),
                linkTo(methodOn(UserController.class).updatePreferences(null, null)).withRel("preferences"));
    }
}