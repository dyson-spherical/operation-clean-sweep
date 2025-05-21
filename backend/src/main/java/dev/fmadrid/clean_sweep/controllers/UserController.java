package dev.fmadrid.clean_sweep.controllers;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UserController {

    @GetMapping("/userinfo")
    public String getUserInfo(@AuthenticationPrincipal OidcUser oidcUser, Model model) {
        model.addAttribute("userInfo", oidcUser.getClaims());
        model.addAttribute("idToken", oidcUser.getIdToken().getTokenValue());
        return "userinfo";
    }
}
