package dev.fmadrid.clean_sweep.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chores")
public class Chore {
    @Id
    private String id;

    private String name;

    private String description;

    private ChoreType type;

    private BigDecimal value;

    private Integer estimatedDuration;

    private DifficultyLevel difficulty;

    private List<String> checklist;

    private Schedule schedule;

    private boolean isFlexible;

    private String createdById;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
