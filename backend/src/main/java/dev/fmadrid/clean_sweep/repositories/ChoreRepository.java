package dev.fmadrid.clean_sweep.repositories;

import java.time.DayOfWeek;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import dev.fmadrid.clean_sweep.domain.Chore;
import dev.fmadrid.clean_sweep.domain.ChoreType;

@RepositoryRestResource(collectionResourceRel = "chores", path = "chores")
public interface ChoreRepository extends MongoRepository<Chore, String> {
    List<Chore> findByScheduleDaysContaining(DayOfWeek day);
    List<Chore> findByIsFlexible(boolean isFlexible);
    List<Chore> findByType(ChoreType type);
}
