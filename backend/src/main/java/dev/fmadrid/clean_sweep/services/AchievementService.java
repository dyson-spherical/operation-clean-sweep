package dev.fmadrid.clean_sweep.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.fmadrid.clean_sweep.domain.Achievement;
import dev.fmadrid.clean_sweep.domain.ChoreType;
import dev.fmadrid.clean_sweep.domain.User;
import dev.fmadrid.clean_sweep.repositories.UserRepository;

@Service
public class AchievementService {
    private final UserRepository userRepository;
    private final VerifierEligibilityService verifierEligibilityService;

    public AchievementService(UserRepository userRepository, VerifierEligibilityService verifierEligibilityService) {
        this.userRepository = userRepository;
        this.verifierEligibilityService = verifierEligibilityService;
    }

    @Transactional
    public void checkAndAwardAchievements(User user) {
        // Prevent achievement farming by checking time between checks
        if (!isValidAchievementCheck(user)) {
            return;
        }

        List<Achievement> newAchievements = new ArrayList<>();

        // Check for various achievement types
        checkChoresCompletedAchievements(user, newAchievements);
        checkStreakAchievements(user, newAchievements);
        checkVerificationAchievements(user, newAchievements);
        checkBalanceAchievements(user, newAchievements);

        // If new achievements were earned, update the user
        if (!newAchievements.isEmpty()) {
            // Validate achievement progress
            if (!isValidAchievementProgress(user, newAchievements)) {
                throw new SecurityException("Invalid achievement progress detected");
            }

            List<Achievement> currentAchievements = new ArrayList<>(user.getAchievements());
            currentAchievements.addAll(newAchievements);
            user.setAchievements(currentAchievements);
            userRepository.save(user);

            // Check if new achievements affect verifier eligibility
            verifierEligibilityService.checkAndUpdateVerifierEligibility(user);
        }
    }

    private boolean isValidAchievementCheck(User user) {
        // Get the last achievement check time from user metadata
        LocalDateTime lastCheck = user.getLastAchievementCheck();
        if (lastCheck == null) {
            return true;
        }

        // Require at least 1 minute between achievement checks
        return LocalDateTime.now().isAfter(lastCheck.plusMinutes(1));
    }

    private boolean isValidAchievementProgress(User user, List<Achievement> newAchievements) {
        for (Achievement achievement : newAchievements) {
            switch (achievement.getType()) {
                case CHORES_COMPLETED:
                    if (user.getCompletedChores() < achievement.getRequiredProgress()) {
                        return false;
                    }
                    break;
                case STREAK_MILESTONE:
                    if (user.getStreakCount() < achievement.getRequiredProgress()) {
                        return false;
                    }
                    break;
                case BALANCE_MILESTONE:
                    if (user.getBalance().intValue() < achievement.getRequiredProgress()) {
                        return false;
                    }
                    break;
                // Add more validation as needed
            }
        }
        return true;
    }

    private void checkChoresCompletedAchievements(User user, List<Achievement> newAchievements) {
        int completedChores = user.getCompletedChores();

        // Example milestones
        if (completedChores >= 10 && !hasAchievement(user, "First 10 Chores")) {
            newAchievements.add(createAchievement(
                    "First 10 Chores",
                    "Completed 10 chores",
                    "chores-10",
                    Achievement.AchievementType.CHORES_COMPLETED,
                    10));
        }

        if (completedChores >= 50 && !hasAchievement(user, "Chore Champion")) {
            newAchievements.add(createAchievement(
                    "Chore Champion",
                    "Completed 50 chores",
                    "chores-50",
                    Achievement.AchievementType.CHORES_COMPLETED,
                    50));
        }
    }

    private void checkStreakAchievements(User user, List<Achievement> newAchievements) {
        int streakCount = user.getStreakCount();

        if (streakCount >= 7 && !hasAchievement(user, "Week Warrior")) {
            newAchievements.add(createAchievement(
                    "Week Warrior",
                    "Maintained a 7-day streak",
                    "streak-7",
                    Achievement.AchievementType.STREAK_MILESTONE,
                    7));
        }
    }

    private void checkVerificationAchievements(User user, List<Achievement> newAchievements) {
        // Example: Award verification achievements based on verified tasks
        if (user.getVerifiableTasks().contains(ChoreType.DISHES) &&
                !hasAchievement(user, "Dishes Expert")) {
            newAchievements.add(createAchievement(
                    "Dishes Expert",
                    "Became eligible to verify dish-related tasks",
                    "verify-dishes",
                    Achievement.AchievementType.VERIFICATION_MILESTONE,
                    1));
        }
    }

    private void checkBalanceAchievements(User user, List<Achievement> newAchievements) {
        int balance = user.getBalance().intValue();

        if (balance >= 100 && !hasAchievement(user, "First Hundred")) {
            newAchievements.add(createAchievement(
                    "First Hundred",
                    "Earned 100 points",
                    "balance-100",
                    Achievement.AchievementType.BALANCE_MILESTONE,
                    100));
        }
    }

    private boolean hasAchievement(User user, String achievementName) {
        return user.getAchievements().stream()
                .anyMatch(a -> a.getName().equals(achievementName));
    }

    private Achievement createAchievement(String name, String description, String icon,
            Achievement.AchievementType type, int requiredProgress) {
        return Achievement.builder()
                .name(name)
                .description(description)
                .icon(icon)
                .type(type)
                .requiredProgress(requiredProgress)
                .unlockedAt(LocalDateTime.now())
                .build();
    }
}