package dev.fmadrid.clean_sweep.repositories;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import dev.fmadrid.clean_sweep.domain.Week;

@RepositoryRestResource(collectionResourceRel = "weeks", path = "weeks")
public interface WeekRepository extends MongoRepository<Week, String> {
    Optional<Week> findByStartDateLessThanEqualAndEndDateGreaterThanEqual(
        LocalDate date, LocalDate sameDate);
}