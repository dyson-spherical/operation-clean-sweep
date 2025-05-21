package dev.fmadrid.clean_sweep.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "assignments")
@CompoundIndexes({
    @CompoundIndex(name = "worker_week_idx", def = "{'workerId': 1, 'weekId': 1}"),
    @CompoundIndex(name = "status_worker_idx", def = "{'status': 1, 'workerId': 1}")
})
public class Assignment {
    @Id
    private String id;

    private String choreId;

    private String workerId;

    private String weekId;

    private AssignmentStatus status;

    private LocalDateTime completedAt;

    private String verifierId;

    private LocalDateTime verifiedAt;

    private String rejectionNotes;

    private String completionEvidence;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
