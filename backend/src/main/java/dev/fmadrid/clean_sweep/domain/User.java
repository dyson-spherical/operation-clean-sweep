package dev.fmadrid.clean_sweep.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String passwordHash;

    private Set<Role> roles;

    private Set<ChoreType> verifiableTasks;

    private BigDecimal balance;

    private Integer completedChores;

    private Integer streakCount;

    private List<Achievement> achievements;

    private UserPreferences preferences;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private LocalDateTime lastLoginAt;

    private LocalDateTime lastAchievementCheck;

    @Data
    @SuperBuilder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserStats {
        @Builder.Default
        private int completedChores = 0;
        @Builder.Default
        private int streakCount = 0;
        @Builder.Default
        private int balance = 0;
        @Builder.Default
        private List<String> achievements = List.of();
    }
}
