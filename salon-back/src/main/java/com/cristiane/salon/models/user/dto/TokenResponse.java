package com.cristiane.salon.models.user.dto;

public record TokenResponse(
        String accessToken,
        String refreshToken
) {}
