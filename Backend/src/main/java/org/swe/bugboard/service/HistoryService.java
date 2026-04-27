package org.swe.bugboard.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.swe.bugboard.dto.HistoryRequest;
import org.swe.bugboard.dto.HistoryResponse;
import org.swe.bugboard.dto.IssueRequest;
import org.swe.bugboard.dto.UserRequest;
import org.swe.bugboard.model.History;
import org.swe.bugboard.model.Issue;
import org.swe.bugboard.model.User;
import org.swe.bugboard.repository.HistoryRepository;
import org.swe.bugboard.repository.IssueRepository;
import org.swe.bugboard.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoryService {
    private final HistoryRepository historyRepository;
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;

    @Transactional
    public void createHistory(HistoryRequest historyRequest, UserRequest userRequest) {
        Issue issue = findIssueOrThrow(historyRequest.getIssueId());

        User user = findUserOrThrow(userRequest.getId());

        History newHistory = History.builder()
                .issue(issue)
                .mainActor(user)
                .action(historyRequest.getAction())
                .date(LocalDateTime.now()).build();

        historyRepository.save(newHistory);
    }

    @Transactional(readOnly = true)
    public List<HistoryResponse> getHistory(IssueRequest issueRequest) {
        List<History> history = historyRepository.findByIssue_IdOrderByDateAsc(issueRequest.getId());

        return history.stream().map(this::convertModelToResponse).toList();
    }

    private Issue findIssueOrThrow(Long issueId) {
        return issueRepository.findById(issueId)
                .orElseThrow(() -> new EntityNotFoundException("Issue non trovata"));
    }

    private User findUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utente non trovato"));
    }

    private HistoryResponse convertModelToResponse(History history) {
        return HistoryResponse.builder()
                .issueId(history.getIssue().getId())
                .mainActorId(history.getMainActor().getId())
                .mainActorUsername(history.getMainActor().getUsername())
                .action(history.getAction())
                .date(history.getDate()).build();
    }
}
