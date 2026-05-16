package com.cristiane.salon.aspect;

import com.cristiane.salon.annotation.Auditable;
import com.cristiane.salon.models.audit.AuditLogService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class AuditAspect {
    
    private final AuditLogService auditLogService;
    private final ObjectMapper objectMapper;
    
    @AfterReturning(
            pointcut = "@annotation(auditable)",
            returning = "result"
    )
    public void logSuccessfulAction(JoinPoint joinPoint, Auditable auditable, Object result) {
        try {
            Long userId = getUserId();
            String userEmail = getUserEmail();
            String action = auditable.action();
            String entityType = auditable.entityType();
            Long entityId = extractEntityId(joinPoint, result);
            String details = auditable.captureArgs() ? extractDetails(joinPoint) : null;
            
            auditLogService.logAction(
                    userId,
                    userEmail,
                    action,
                    entityType,
                    entityId,
                    details,
                    "SUCCESS"
            );
        } catch (Exception e) {
            // Log silenciosamente para não quebrar a aplicação
        }
    }
    
    @AfterThrowing(
            pointcut = "@annotation(auditable)",
            throwing = "exception"
    )
    public void logFailedAction(JoinPoint joinPoint, Auditable auditable, Exception exception) {
        try {
            Long userId = getUserId();
            String userEmail = getUserEmail();
            String action = auditable.action();
            String entityType = auditable.entityType();
            
            auditLogService.logAction(
                    userId,
                    userEmail,
                    action,
                    entityType,
                    null,
                    null,
                    "FAILURE",
                    exception.getMessage()
            );
        } catch (Exception e) {
            // Log silenciosamente para não quebrar a aplicação
        }
    }
    
    private Long getUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof org.springframework.security.core.userdetails.User) {
            // Você pode precisar de um atributo customizado para guardar o userId
            return null;
        }
        return null;
    }
    
    private String getUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            return auth.getName();
        }
        return "SYSTEM";
    }
    
    private Long extractEntityId(JoinPoint joinPoint, Object result) {
        if (result != null && result instanceof Number) {
            return ((Number) result).longValue();
        }
        
        Object[] args = joinPoint.getArgs();
        for (Object arg : args) {
            if (arg instanceof Long) {
                return (Long) arg;
            }
        }
        return null;
    }
    
    private String extractDetails(JoinPoint joinPoint) {
        try {
            Object[] args = joinPoint.getArgs();
            return objectMapper.writeValueAsString(args);
        } catch (Exception e) {
            return null;
        }
    }
}
