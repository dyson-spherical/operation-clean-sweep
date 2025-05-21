package dev.fmadrid.clean_sweep.domain;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferences {
    @NotNull
    private Boolean notifications;

    @NotNull
    private String theme;

    @NotNull
    private Boolean emailReminders;

    @NotNull
    private Boolean celebrationAnimations;
}
