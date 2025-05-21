package dev.fmadrid.clean_sweep.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import dev.fmadrid.clean_sweep.domain.Assignment;
import dev.fmadrid.clean_sweep.domain.AssignmentStatus;

@RepositoryRestResource(collectionResourceRel = "assignments", path = "assignments")
public interface AssignmentRepository extends MongoRepository<Assignment, String> {
    List<Assignment> findByWorkerIdAndStatus(String workerId, AssignmentStatus status);
    List<Assignment> findByStatusAndChoreId(AssignmentStatus status, String choreId);
    List<Assignment> findByWeekIdAndWorkerId(String weekId, String workerId);
    List<Assignment> findByWeekIdAndStatus(String weekId, AssignmentStatus status);
}