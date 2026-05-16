package com.cristiane.salon.security;

import com.cristiane.salon.models.user.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component("verifyUserPermissions")
@RequiredArgsConstructor
public class VerifyUserPermissions {

    private final CustomPermissionEvaluator permissionEvaluator;
    private final HttpServletRequest request;

    public boolean userOwnResourceOrHasPermission(Long userId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return false;
        }

        Object principal = auth.getPrincipal();
        if (!(principal instanceof User)) {
            return false;
        }
        User logged = (User) principal;

        // Check explicit permission via endpoint/method
        if (permissionEvaluator.hasPermission(auth, request.getRequestURI(), request.getMethod())) {
            return true;
        }

        // For actions like deleting or creating another user, explicit permission is required.
        // User cannot delete themselves unless they have permission, nor can they create (POST).
        if ("DELETE".equalsIgnoreCase(request.getMethod()) || "POST".equalsIgnoreCase(request.getMethod())) {
            return false;
        }

        // Allow if user is modifying/reading their own profile
        return logged.getId().equals(userId);
    }
}
