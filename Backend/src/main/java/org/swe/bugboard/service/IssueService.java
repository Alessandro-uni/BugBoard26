package org.swe.bugboard.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.swe.bugboard.dto.UpdateIssueRequest;
import org.swe.bugboard.dto.IssueResponse;
import org.swe.bugboard.dto.ReportIssueRequest;
import org.swe.bugboard.dto.UserRequest;
import org.swe.bugboard.model.*;
import org.swe.bugboard.repository.IssueRepository;
import org.swe.bugboard.repository.TagRepository;
import org.swe.bugboard.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IssueService {
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;

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
    public List<IssueResponse> getIssueToAssigned() {
        List<Issue> issues = issueRepository.getIssueByAssignedUserNull();

        return issues.stream().map(this::convertToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<IssueResponse> getIssueWithPriority() {
        List<Issue> issues = issueRepository.getIssueByPriority(true);

        return issues.stream().map(this::convertToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<IssueResponse> getIssueByReportingUser(UserRequest userRequest) {
        List<Issue> issues = issueRepository.getIssueByReportingUserId(userRequest.getId());

        return issues.stream().map(this::convertToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<IssueResponse> getIssueByAssignedUser(UserRequest userRequest) {
        List<Issue> issues = issueRepository.getIssueByAssignedUserId(userRequest.getId());

        return issues.stream().map(this::convertToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<IssueResponse> getIssueByType(IssueType type) {
        List<Issue> issues = issueRepository.getIssueByType(type);

        return issues.stream().map(this::convertToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<IssueResponse> getIssueByTags(Long id) {
        List<Issue> issues = issueRepository.getIssueByTagsId(id);

        return issues.stream().map(this::convertToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<IssueResponse> getIssueByStatus(IssueStatus status) {
        List<Issue> issues = issueRepository.getIssueByStatus(status);

        return issues.stream().map(this::convertToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<IssueResponse> getIssueByCreationDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<Issue> issues = issueRepository.findByCreationDateRange(startDate, endDate);

        return issues.stream().map(this::convertToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<IssueResponse> getIssueByLastModifiedDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<Issue> issues = issueRepository.findByLastModifiedDateRange(startDate, endDate);

        return issues.stream().map(this::convertToDto).toList();
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
