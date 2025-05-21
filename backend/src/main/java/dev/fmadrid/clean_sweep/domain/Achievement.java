package dev.fmadrid.clean_sweep.domain;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "achievements")
public class Achievement {
    @Id
    private String id;
    private String name;
    private String description;
    private String icon;
    private AchievementType type;
    private int requiredProgress;
    private LocalDateTime unlockedAt;
    private String userId; // Reference to the user who earned this achievement

    public enum AchievementType {
        CHORES_COMPLETED, // Complete X chores
        STREAK_MILESTONE, // Maintain a streak for X days
        VERIFICATION_MILESTONE, // Verify X tasks
        BALANCE_MILESTONE, // Reach X balance
        SPECIAL_EVENT // Special one-time achievements
    }
}
