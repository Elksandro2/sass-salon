package com.cristiane.salon.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;

@Component
public class CustomPermissionEvaluator {

    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    public boolean hasPermission(Authentication auth, String endpoint, String method) {
        for (GrantedAuthority authority : auth.getAuthorities()) {
            String authorityStr = authority.getAuthority();

            if (authorityStr.startsWith("ROLE_")) {
                continue;
            }

            // Expected format: METHOD:ENDPOINT (e.g. GET:/v1/users)
            String[] parts = authorityStr.split(":", 2);
            if (parts.length != 2) continue;

            String allowedMethod = parts[0];
            String allowedEndpoint = parts[1];

            boolean methodMatches = allowedMethod.equals("*") || allowedMethod.equalsIgnoreCase(method);
            boolean endpointMatches = pathMatcher.match(allowedEndpoint, endpoint);

            if (methodMatches && endpointMatches) {
                return true;
            }
        }
        return false;
    }
}
