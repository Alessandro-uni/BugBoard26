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
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IssueService {
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;

    private List<Issue> issueList;

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

        return convertToDto(issueRepository.save(issue));
    }

    @Transactional
    public IssueResponse updateIssueStatus(UpdateIssueRequest request) {
        IssueStatus oldStatus = findStatusOrThrow(request.getStatus());
        IssueStatus newStatus = findStatusOrThrow(request.getNewStatus());

        if (oldStatus == IssueStatus.RESOLVED || oldStatus == IssueStatus.CLOSED) {
            throw new UnsupportedOperationException("Impossibile modificare lo stato di una Issue che si trova nello stato '" + oldStatus.name() + "'");
        }

        if (newStatus == IssueStatus.TODO) {
            throw new UnsupportedOperationException("Impossibile modificare lo stato di una Issue in '" + request.getStatus() + "'");
        }

        Issue issue = findIssueOrThrow(request.getId());
        issue.setStatus(newStatus);

        return convertToDto(issueRepository.save(issue));
    }

    @Transactional
    public IssueResponse assignUserToIssue(UpdateIssueRequest issueRequest, UserRequest userRequest) {
        Issue issue = findIssueOrThrow(issueRequest.getId());
        User assignedUser = findUserOrThrow(userRequest.getId());
        issue.setAssignedUser(assignedUser);

        return convertToDto(issueRepository.save(issue));
    }

    @Transactional(readOnly = true)
    public List<IssueResponse> getAllIssue() {
        List<Issue> issues = issueRepository.findAll();

        return issues.stream().map(this::convertToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<IssueResponse> getFilteredIssues(IssueRequest request){
        issueList = null;

        if (request.getAssignedUserId() == -1) { //todo: ricorda di metterlo così nel frontend
            getIssuesToBeAssigned();
        } else {
            getIssuesByAssignedUser(request.getAssignedUserId());
        }
        getIssuesByReportingUser(request.getReportingUserId());
        getIssuesByTags(request.getTags());
        getIssuesByCreationDateRange(request.getStartCreationDate(), request.getEndCreationDate());
        getIssuesByLastModifiedDateRange(request.getStartLastModifiedDate(), request.getEndLastModifiedDate());
        getIssuesByStatus(IssueStatus.valueOf(request.getStatus()));
        getIssuesByType(IssueType.valueOf(request.getType()));
        getIssuesWithPriority(request.getPriority());

        return issueList.stream().map(this::convertToDto).toList();
    }

    @Transactional(readOnly = true)
    protected void getIssuesToBeAssigned() {
        if (issueList == null) {
            issueList = issueRepository.findIssueWithNoAssignedUser();
        } else {
            issueList = issueList.stream().filter(issue -> issue.getAssignedUser() == null).toList();
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
            issueList = issueList.stream().filter(issue -> issue.getPriority() == priority).toList();
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
    protected void getIssuesByAssignedUser(Long assignedUserId) {
        if (assignedUserId == null) {
            return;
        }

        if (issueList == null) {
            issueList = issueRepository.getIssueByAssignedUserId(assignedUserId);
        } else {
            issueList = issueList.stream().filter(issue -> Objects.equals(issue.getReportingUser().getId(), assignedUserId)).toList();
        }
    }

    @Transactional(readOnly = true)
    protected void getIssuesByType(IssueType type) {
        if (type == null) {
            return;
        }

        if (issueList == null) {
            issueList = issueRepository.getIssueByType(type);
        } else {
            issueList = issueList.stream().filter(issue -> issue.getType().equals(type)).toList();
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
    protected void getIssuesByStatus(IssueStatus status) {
        if (status == null) {
            return;
        }

        if (issueList == null) {
            issueList = issueRepository.getIssueByStatus(status);
        } else {
            issueList = issueList.stream().filter(issue -> issue.getStatus() == status).toList();
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

    private IssueResponse convertToDto(Issue issue) {
        return IssueResponse.builder().id(issue.getId())
                .title(issue.getTitle())
                .description(issue.getDescription())
                .type(issue.getType().name())
                .status(issue.getStatus().name())
                .priority(issue.getPriority())
                .tags(issue.getTags().stream().map(Tag::getName).collect(Collectors.toSet()))
                .image(issue.getImage())
                .creationDate(issue.getCreationDate())
                .lastModifiedDate(issue.getLastModifiedDate())
                .reportingUserId(issue.getReportingUser().getId())
                .reportingUserUsername(issue.getReportingUser().getUsername())
                .assignedUserId(issue.getAssignedUser().getId())
                .assignedUserUsername(issue.getAssignedUser().getUsername()).build();
    }
}
