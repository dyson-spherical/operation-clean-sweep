package dev.fmadrid.clean_sweep.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferences {
    private boolean notifications;
    private String theme;
    private boolean emailReminders;
    private boolean celebrationAnimations;
}
