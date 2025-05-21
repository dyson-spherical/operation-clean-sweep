package dev.fmadrid.clean_sweep.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Schedule {
    private ScheduleType type;
    private Set<DayOfWeek> days;
}
