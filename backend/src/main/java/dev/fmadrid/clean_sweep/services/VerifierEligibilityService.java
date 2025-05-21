package dev.fmadrid.clean_sweep.services;

import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Service;

import dev.fmadrid.clean_sweep.domain.Achievement;
import dev.fmadrid.clean_sweep.domain.ChoreType;
import dev.fmadrid.clean_sweep.domain.User;
import dev.fmadrid.clean_sweep.repositories.UserRepository;

@Service
public class VerifierEligibilityService {
    private final UserRepository userRepository;

    public VerifierEligibilityService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void checkAndUpdateVerifierEligibility(User user) {
        Set<ChoreType> eligibleTasks = new HashSet<>();

        // Check achievements and other criteria for each task type
        for (ChoreType taskType : ChoreType.values()) {
            if (isEligibleForTaskType(user, taskType)) {
                eligibleTasks.add(taskType);
            }
        }

        // Update user's verifiable tasks if changed
        if (!eligibleTasks.equals(user.getVerifiableTasks())) {
            user.setVerifiableTasks(eligibleTasks);
            userRepository.save(user);
        }
    }

    private boolean isEligibleForTaskType(User user, ChoreType taskType) {
        // Example criteria for different task types
        switch (taskType) {
            case DISHES:
                return hasDishesVerificationAchievement(user);
            case BATHROOM_CLEANING:
                return hasBathroomVerificationAchievement(user);
            case LAUNDRY:
                return hasLaundryVerificationAchievement(user);
            // Add more task types as needed
            default:
                return false;
        }
    }

    private boolean hasDishesVerificationAchievement(User user) {
        return user.getAchievements().stream()
                .anyMatch(achievement -> achievement.getType() == Achievement.AchievementType.VERIFICATION_MILESTONE &&
                        achievement.getName().contains("Dishes"));
    }

    private boolean hasBathroomVerificationAchievement(User user) {
        return user.getAchievements().stream()
                .anyMatch(achievement -> achievement.getType() == Achievement.AchievementType.VERIFICATION_MILESTONE &&
                        achievement.getName().contains("Bathroom"));
    }

    private boolean hasLaundryVerificationAchievement(User user) {
        return user.getAchievements().stream()
                .anyMatch(achievement -> achievement.getType() == Achievement.AchievementType.VERIFICATION_MILESTONE &&
                        achievement.getName().contains("Laundry"));
    }
}