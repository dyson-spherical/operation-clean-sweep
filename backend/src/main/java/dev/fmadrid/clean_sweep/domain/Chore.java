package dev.fmadrid.clean_sweep.domain;

import java.time.Instant;
import java.util.UUID;

public record Chore(
    UUID id,
    String name,
    String description,
    Instant lastUpdated,
    Integer value
) {

}
