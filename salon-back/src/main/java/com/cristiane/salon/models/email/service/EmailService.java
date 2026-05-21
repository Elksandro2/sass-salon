package com.cristiane.salon.models.email.service;

import com.cristiane.salon.models.appointment.entity.Appointment;
import com.cristiane.salon.models.featureflag.service.FeatureFlagService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final FeatureFlagService featureFlagService;

    public void sendRequestNotificationToStaff(Appointment appointment) {
        if (!featureFlagService.isEnabled("EMAIL_NOTIFICATIONS")) {
            log.info("Envio de e-mail desativado por Feature Flag (EMAIL_NOTIFICATIONS).");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("admin@salao.com");
            message.setSubject("Novo Pedido de Agendamento Recebido");
            message.setText(String.format(
                    "Olá equipe,\n\nUm novo agendamento foi solicitado pelo cliente %s.\n\n" +
                    "Serviço: %s\n" +
                    "Profissional: %s\n" +
                    "Data preferida: %s\n" +
                    "Observações: %s\n\n" +
                    "Por favor, acesse o sistema para confirmar ou reagendar.",
                    appointment.getClient().getName(),
                    appointment.getSalonService().getName(),
                    appointment.getEmployee().getUser().getName(),
                    appointment.getPreferredDate() != null ? appointment.getPreferredDate().toString() : "Não informada",
                    appointment.getClientNotes() != null ? appointment.getClientNotes() : ""
            ));
            mailSender.send(message);
            log.info("E-mail de notificação de solicitação enviado com sucesso para a equipe.");
        } catch (Exception e) {
            log.warn("Falha ao enviar e-mail de solicitação para a equipe: {}", e.getMessage());
        }
    }

    public void sendConfirmationNotificationToClient(Appointment appointment) {
        if (!featureFlagService.isEnabled("EMAIL_NOTIFICATIONS")) {
            log.info("Envio de e-mail desativado por Feature Flag (EMAIL_NOTIFICATIONS).");
            return;
        }

        String clientEmail = appointment.getClient().getEmail();
        if (clientEmail == null || clientEmail.trim().isEmpty()) {
            log.info("Cliente não possui e-mail cadastrado.");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(clientEmail);
            message.setSubject("Seu Agendamento foi Confirmado!");
            message.setText(String.format(
                    "Olá %s,\n\nSeu agendamento foi confirmado com sucesso!\n\n" +
                    "Serviço: %s\n" +
                    "Profissional: %s\n" +
                    "Data/Hora: %s\n\n" +
                    "Esperamos por você!",
                    appointment.getClient().getName(),
                    appointment.getSalonService().getName(),
                    appointment.getEmployee().getUser().getName(),
                    appointment.getScheduledAt() != null ? appointment.getScheduledAt().toString() : "Pendente"
            ));
            mailSender.send(message);
            log.info("E-mail de confirmação enviado com sucesso para: {}", clientEmail);
        } catch (Exception e) {
            log.warn("Falha ao enviar e-mail de confirmação para o cliente {}: {}", clientEmail, e.getMessage());
        }
    }

    public void sendCancellationNotification(Appointment appointment) {
        if (!featureFlagService.isEnabled("EMAIL_NOTIFICATIONS")) {
            log.info("Envio de e-mail desativado por Feature Flag (EMAIL_NOTIFICATIONS).");
            return;
        }

        // Notify client
        String clientEmail = appointment.getClient().getEmail();
        if (clientEmail != null && !clientEmail.trim().isEmpty()) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(clientEmail);
                message.setSubject("Agendamento Cancelado");
                message.setText(String.format(
                        "Olá %s,\n\nSeu agendamento para o serviço '%s' com a profissional %s em %s foi cancelado.",
                        appointment.getClient().getName(),
                        appointment.getSalonService().getName(),
                        appointment.getEmployee().getUser().getName(),
                        appointment.getScheduledAt() != null ? appointment.getScheduledAt().toString() : "Data pendente"
                ));
                mailSender.send(message);
                log.info("E-mail de cancelamento enviado com sucesso para o cliente: {}", clientEmail);
            } catch (Exception e) {
                log.warn("Falha ao enviar e-mail de cancelamento para o cliente {}: {}", clientEmail, e.getMessage());
            }
        }

        // Notify staff/admin
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("admin@salao.com");
            message.setSubject("Agendamento Cancelado");
            message.setText(String.format(
                    "Olá equipe,\n\nO agendamento do cliente %s para o serviço '%s' com a profissional %s em %s foi cancelado.",
                    appointment.getClient().getName(),
                    appointment.getSalonService().getName(),
                    appointment.getEmployee().getUser().getName(),
                    appointment.getScheduledAt() != null ? appointment.getScheduledAt().toString() : "Data pendente"
            ));
            mailSender.send(message);
            log.info("E-mail de cancelamento enviado com sucesso para a equipe.");
        } catch (Exception e) {
            log.warn("Falha ao enviar e-mail de cancelamento para a equipe: {}", e.getMessage());
        }
    }
}
