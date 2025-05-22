package dev.fmadrid.clean_sweep.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.IndexOperations;
import org.springframework.data.mongodb.core.index.IndexResolver;
import org.springframework.data.mongodb.core.index.MongoPersistentEntityIndexResolver;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;

import dev.fmadrid.clean_sweep.domain.User;

@Configuration
public class MongoConfig {

    @Bean
    public IndexOperations ensureIndexes(MongoTemplate mongoTemplate, MongoMappingContext mongoMappingContext) {
        // Create indexes for User collection
        IndexOperations indexOps = mongoTemplate.indexOps(User.class);
        IndexResolver resolver = new MongoPersistentEntityIndexResolver(mongoMappingContext);
        resolver.resolveIndexFor(User.class).forEach(indexOps::ensureIndex);
        return indexOps;
    }
}