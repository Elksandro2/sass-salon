package com.cristiane.salon.controllers;

import com.cristiane.salon.controller.AuthController;
import com.cristiane.salon.models.user.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
class AuthControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private AuthService authService;

    @Test
    void loginReturns200_whenValid() throws Exception {
        when(authService.login(any())).thenReturn(null);

        String body = "{\"email\":\"a@b.com\",\"password\":\"123456\"}";

        mvc.perform(post("/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isOk());
    }

    @Test
    void loginReturns400_whenInvalid() throws Exception {
        String body = "{}";

        mvc.perform(post("/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isBadRequest());
    }

    @TestConfiguration
    static class TestConfig {
        @Bean
        public AuthService authService() {
            return Mockito.mock(AuthService.class);
        }
        
        @Bean
        public MockMvc mockMvc(WebApplicationContext wac) {
            return MockMvcBuilders.webAppContextSetup(wac).build();
        }
    }
}
