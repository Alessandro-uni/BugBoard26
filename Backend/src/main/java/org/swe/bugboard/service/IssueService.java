package org.swe.bugboard.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.swe.bugboard.dto.*;
import org.swe.bugboard.model.*;
import org.swe.bugboard.repository.IssueRepository;
import org.swe.bugboard.repository.TagRepository;
import org.swe.bugboard.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IssueService {
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final HistoryService historyService;

    private List<Issue> issueList; // todo: potenzialmente pericolo, decidere se tenerlo

    @Transactional
    public IssueResponse createIssue(ReportIssueRequest reportIssueRequest, UserRequest userRequest) {
        User reportingUser = findUserOrThrow(userRequest.getId());

        Set<Tag> tags = tagRepository.findByNameIn(reportIssueRequest.getTags());

        Issue issue = Issue.builder()
                .title(reportIssueRequest.getTitle())
                .description(reportIssueRequest.getDescription())
                .type(IssueType.valueOf(reportIssueRequest.getType()))
                .status(IssueStatus.TODO)
                .priority(reportIssueRequest.getPriority())
                .tags(tags)
                .image(reportIssueRequest.getImage())
                .creationDate(LocalDateTime.now())
                .lastModifiedDate(LocalDateTime.now())
                .reportingUser(reportingUser)
                .assignedUser(null).build();

        Issue savedIssue = issueRepository.save(issue);

        HistoryRequest historyRequest = new HistoryRequest(savedIssue.getId(), "Segnalata issue");
        historyService.createHistory(historyRequest, userRequest);

        return convertModelToResponse(savedIssue);
    }

    @Transactional
    public IssueResponse updateIssueStatus(UpdateIssueRequest updateIssueRequest, UserRequest userRequest) {
        User assignedUser = findUserOrThrow(userRequest.getId());
        Issue issue = findIssueOrThrow(updateIssueRequest.getId());

        if (!Objects.equals(assignedUser.getId(), issue.getAssignedUser().getId())) {
            throw new UnsupportedOperationException("Utente non abilitato a modificare lo stato di questa issue");
        }

        IssueStatus oldStatus = issue.getStatus();
        IssueStatus newStatus = findStatusOrThrow(updateIssueRequest.getNewStatus());

        if (oldStatus == newStatus) {
            throw new UnsupportedOperationException("La issue si trova già nello stato: " + oldStatus.name());
        }

        if (oldStatus == IssueStatus.RESOLVED || oldStatus == IssueStatus.CLOSED) {
            throw new UnsupportedOperationException("Impossibile modificare lo stato di una Issue che si trova nello stato '" + oldStatus.name() + "'");
        }

        if (newStatus == IssueStatus.TODO) {
            throw new UnsupportedOperationException("Impossibile modificare lo stato di una Issue in '" + updateIssueRequest.getNewStatus() + "'");
        }

        issue.setStatus(newStatus);

        Issue savedIssue = issueRepository.save(issue);

        HistoryRequest historyRequest = new HistoryRequest(savedIssue.getId(), "Stato aggiornato in: " + savedIssue.getStatus());
        historyService.createHistory(historyRequest, userRequest);

        return convertModelToResponse(savedIssue);
    }

    @Transactional
    public IssueResponse closeIssue(UpdateIssueRequest closeIssueRequest, UserRequest userRequest) {
        Issue issue = findIssueOrThrow(closeIssueRequest.getId());

        if (issue.getStatus().equals(IssueStatus.CLOSED)) {
            throw new UnsupportedOperationException("La issue si trova già nello stato: " + issue.getStatus().name());
        }

        issue.setStatus(IssueStatus.CLOSED);

        Issue savedIssue = issueRepository.save(issue);

        HistoryRequest historyRequest = new HistoryRequest(savedIssue.getId(), "La issue è stata chiusa poiché ritenuta duplicata "); // todo: completare la frase...
        historyService.createHistory(historyRequest, userRequest);

        return convertModelToResponse(savedIssue);
    }

    @Transactional
    public IssueResponse assignUserToIssue(UpdateIssueRequest issueRequest, UserRequest userToAssign, UserRequest userRequest) {
        Issue issue = findIssueOrThrow(issueRequest.getId());

        if (issue.getAssignedUser() != null) {
            throw new UnsupportedOperationException("Issue già assegnata all'utente: " + issue.getAssignedUser().getUsername());
        }

        if (!issue.getStatus().equals(IssueStatus.TODO)) {
            throw new UnsupportedOperationException("Impossibile assegnare questa issue, si trova già nello stato: " + issue.getStatus().name());
        }

        User assignedUser = findUserOrThrow(userToAssign.getId());
        issue.setAssignedUser(assignedUser);

        Issue savedIssue = issueRepository.save(issue);

        HistoryRequest historyRequest = new HistoryRequest(savedIssue.getId(), "Issue assegnata all'utente: " + savedIssue.getAssignedUser().getUsername());
        historyService.createHistory(historyRequest, userRequest);

        return convertModelToResponse(savedIssue);
    }

    @Transactional(readOnly = true)
    public List<IssueResponse> getAllIssue() {
        List<Issue> issues = issueRepository.findAll();

        return issues.stream().map(this::convertModelToResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<IssueResponse> getFilteredIssues(IssueRequest request){
        issueList = null;

        getIssuesByAssignedUser(request.getAssignedUserId());
        getIssuesByReportingUser(request.getReportingUserId());
        getIssuesByTags(request.getTags());
        getIssuesByCreationDateRange(request.getStartCreationDate(), request.getEndCreationDate());
        getIssuesByLastModifiedDateRange(request.getStartLastModifiedDate(), request.getEndLastModifiedDate());
        getIssuesByStatus(request.getStatus());
        getIssuesByType(request.getType());
        getIssuesWithPriority(request.getPriority());

        return issueList.stream().map(this::convertModelToResponse).toList();
    }

    @Transactional(readOnly = true)
    protected void getIssuesToBeAssigned() {
        if (issueList == null) {
            issueList = issueRepository.getIssueByAssignedUserNull();
        } else {
            issueList = issueList.stream().filter(issue -> issue.getAssignedUser() == null).toList();
        }
    }

    @Transactional(readOnly = true)
    protected void getIssuesByAssignedUser(Long assignedUserId) {
        if (assignedUserId == null) {
            return;
        }

        if (assignedUserId == -1) { //todo: ricorda di metterlo così nel frontend
            getIssuesToBeAssigned();
            return;
        }

        if (issueList == null) {
            issueList = issueRepository.getIssueByAssignedUserId(assignedUserId);
        } else {
            issueList = issueList.stream().filter(issue -> Objects.equals(issue.getReportingUser().getId(), assignedUserId)).toList();
        }
    }

    @Transactional(readOnly = true)
    protected void getIssuesWithPriority(Boolean priority) {
        if (priority == null) {
            return;
        }

        if (issueList == null) {
            issueList = issueRepository.getIssueByPriority(true);
        } else {
            issueList = issueList.stream().filter(issue -> Objects.equals(issue.getPriority(), priority)).toList();
        }
    }

    @Transactional(readOnly = true)
    protected void getIssuesByReportingUser(Long reportingUserId) {
        if (reportingUserId == null) {
            return;
        }

        if (issueList == null) {
            issueList = issueRepository.getIssueByReportingUserId(reportingUserId);
        } else {
            issueList = issueList.stream().filter(issue -> Objects.equals(issue.getReportingUser().getId(), reportingUserId)).toList();
        }
    }

    @Transactional(readOnly = true)
    protected void getIssuesByType(String type) {
        if (type == null) {
            return;
        }

        IssueType issueType = IssueType.valueOf(type.toUpperCase());

        if (issueList == null) {
            issueList = issueRepository.getIssueByType(issueType);
        } else {
            issueList = issueList.stream().filter(issue -> issue.getType().equals(issueType)).toList();
        }
    }

    @Transactional(readOnly = true)
    protected void getIssuesByTags(Set<String> tagNames) {
        if (tagNames == null) {
            return;
        }

        if (issueList == null) {
            if(tagNames.isEmpty()){
                issueList = issueRepository.findIssuesWithNoTags();
            } else {
                for (String s : tagNames) {
                    issueList = new ArrayList<>();
                    issueList.addAll(issueRepository.getIssueByTagsName(s)); //todo: testa se funziona...
                }
            }
        } else {
            Set<Tag> tags = tagRepository.findByNameIn(tagNames);
            issueList = issueList.stream().filter(issue -> issue.getTags().equals(tags)).toList();
        }
    }

    @Transactional(readOnly = true)
    protected void getIssuesByStatus(String status) {
        if (status == null) {
            return;
        }

        IssueStatus issueStatus = IssueStatus.valueOf(status);

        if (issueList == null) {
            issueList = issueRepository.getIssueByStatus(issueStatus);
        } else {
            issueList = issueList.stream().filter(issue -> issue.getStatus() == issueStatus).toList();
        }
    }

    @Transactional(readOnly = true)
    protected void getIssuesByCreationDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate == null && endDate == null) {
            return;
        }

        if (issueList == null) {
            issueList = issueRepository.findByCreationDateRange(startDate, endDate);
        } else {
            issueList = issueList.stream()
                    .filter(issue -> (issue.getCreationDate().isAfter(startDate) && issue.getCreationDate().isBefore(endDate)))
                    .toList();
        }
    }

    @Transactional(readOnly = true)
    protected void getIssuesByLastModifiedDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate == null && endDate == null) {
            return;
        }

        if (issueList == null) {
            issueList = issueRepository.findByLastModifiedDateRange(startDate, endDate);
        } else {
            issueList = issueList.stream()
                    .filter(issue -> (issue.getLastModifiedDate().isAfter(startDate) && issue.getLastModifiedDate().isBefore(endDate)))
                    .toList();
        }
    }

    private Issue findIssueOrThrow(Long issueId) {
        return issueRepository.findById(issueId)
                .orElseThrow(() -> new EntityNotFoundException("Issue non trovata"));
    }

    private User findUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utente non trovato"));
    }

    private IssueStatus findStatusOrThrow(String status) {
        try {
            return IssueStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Stato '" + status + "' non valido");
        }
    }

    private IssueResponse convertModelToResponse(Issue issue) {
        return IssueResponse.builder().id(issue.getId())
                .title(issue.getTitle())
                .description(issue.getDescription())
                .type(issue.getType().name())
                .status(issue.getStatus().name())
                .priority(issue.getPriority())
                .tags(
                        Optional.ofNullable(issue.getTags())
                                .orElse(Collections.emptySet())
                                .stream()
                                .map(Tag::getName)
                                .collect(Collectors.toSet())
                )
                .image(issue.getImage())
                .creationDate(issue.getCreationDate())
                .lastModifiedDate(issue.getLastModifiedDate())
                .reportingUserId(issue.getReportingUser().getId())
                .reportingUserUsername(issue.getReportingUser().getUsername())
                .assignedUserId(
                        Optional.ofNullable(issue.getAssignedUser())
                                .map(User::getId)
                                .orElse(null))
                .assignedUserUsername(
                        Optional.ofNullable(issue.getAssignedUser())
                                .map(User::getUsername)
                                .orElse(null))
                .build();
    }
}
