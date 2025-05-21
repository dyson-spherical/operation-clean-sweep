package dev.fmadrid.clean_sweep.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import dev.fmadrid.clean_sweep.domain.Transaction;
import dev.fmadrid.clean_sweep.domain.TransactionType;

@RepositoryRestResource(collectionResourceRel = "transactions", path = "transactions")
public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByUserId(String userId);
    List<Transaction> findByUserIdAndType(String userId, TransactionType type);
}
