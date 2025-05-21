package dev.fmadrid.clean_sweep.repositories;

import java.util.UUID;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import dev.fmadrid.clean_sweep.domain.Chore;

@Repository
public interface ChoreService extends PagingAndSortingRepository<Chore, UUID>  {
}