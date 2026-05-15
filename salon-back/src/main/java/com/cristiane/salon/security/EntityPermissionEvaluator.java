package com.cristiane.salon.security;

import com.cristiane.salon.models.user.entity.User;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.io.Serializable;

@Component
public class EntityPermissionEvaluator implements PermissionEvaluator {

    @Override
    public boolean hasPermission(Authentication auth, Object targetDomainObject, Object permission) {
        return false; // Not used currently
    }

    @Override
    public boolean hasPermission(Authentication auth, Serializable targetId, String targetType, Object permission) {
        if (auth == null || auth.getPrincipal() == null || !(auth.getPrincipal() instanceof User user)) {
            return false;
        }

        if ("ADMIN".equals(user.getRoleName())) {
            return true;
        }

        if ("USER".equalsIgnoreCase(targetType)) {
            return handleUserPermission(user, (Long) targetId, permission.toString());
        }

        return false;
    }

    private boolean handleUserPermission(User logged, Long targetId, String action) {
        if ("GERENTE_DE_ATENDIMENTO".equals(logged.getRoleName())) {
            return true;
        }

        if ("READ".equalsIgnoreCase(action) || "UPDATE".equalsIgnoreCase(action) || "DELETE".equalsIgnoreCase(action)) {
            return logged.getId().equals(targetId);
        }

        return false;
    }
}
