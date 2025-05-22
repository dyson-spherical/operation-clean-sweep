package dev.fmadrid.clean_sweep.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.fmadrid.clean_sweep.domain.Week;
import dev.fmadrid.clean_sweep.repositories.WeekRepository;

import java.time.LocalDate;

@RestController
@RequestMapping("/weeks")
public class WeekController {

    private final WeekRepository weekRepository;

    @Autowired
    public WeekController(WeekRepository weekRepository) {
        this.weekRepository = weekRepository;
    }

    /**
     * Get the current active week
     *
     * @return the current week or 404 if no active week is found
     */
    @GetMapping("/current")
    public ResponseEntity<Week> getCurrentWeek() {
        LocalDate today = LocalDate.now();

        // Find a week where today is between startDate and endDate
        return weekRepository.findByStartDateLessThanEqualAndEndDateGreaterThanEqual(today, today)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
