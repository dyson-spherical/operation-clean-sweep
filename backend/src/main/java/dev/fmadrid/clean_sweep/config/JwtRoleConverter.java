package dev.fmadrid.clean_sweep.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class JwtRoleConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final JwtGrantedAuthoritiesConverter defaultConverter = new JwtGrantedAuthoritiesConverter();

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        Collection<GrantedAuthority> defaultAuthorities = defaultConverter.convert(jwt);

        // Extract roles from Authentik JWT claims
        // Adjust this based on your Authentik configuration
        Map<String, Object> claims = jwt.getClaims();

        // This assumes roles are in a claim called "groups" or "roles"
        // Modify according to your Authentik configuration
        List<String> roles = extractRoles(claims);

        // Convert roles to authorities with "ROLE_" prefix
        List<GrantedAuthority> roleAuthorities = roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                .collect(Collectors.toList());

        // Combine default authorities with role authorities
        Collection<GrantedAuthority> allAuthorities = Stream.concat(
                defaultAuthorities.stream(),
                roleAuthorities.stream()
        ).collect(Collectors.toList());

        return new JwtAuthenticationToken(jwt, allAuthorities);
    }

    @SuppressWarnings("unchecked")
    private List<String> extractRoles(Map<String, Object> claims) {
        // Check for groups claim (common in Authentik)
        if (claims.containsKey("groups")) {
            return (List<String>) claims.get("groups");
        }

        // Check for roles claim
        if (claims.containsKey("roles")) {
            return (List<String>) claims.get("roles");
        }

        // Alternatively, check for custom claims that might contain roles
        // Adjust based on your Authentik configuration
        if (claims.containsKey("authentik") && claims.get("authentik") instanceof Map) {
            Map<String, Object> authentikClaims = (Map<String, Object>) claims.get("authentik");
            if (authentikClaims.containsKey("groups")) {
                return (List<String>) authentikClaims.get("groups");
            }
        }

        return List.of(); // Return empty list if no roles found
    }
}
