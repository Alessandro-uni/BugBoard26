package org.swe.bugboard.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.swe.bugboard.dto.IssueDto;
import org.swe.bugboard.model.*;
import org.swe.bugboard.repository.IssueRepository;
import org.swe.bugboard.repository.TagRepository;
import org.swe.bugboard.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IssueService {
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;

    @Transactional
    public IssueDto createIssue(IssueDto issueDto, Long reportingUserId) {
        User reportingUser = findUserOrThrow(reportingUserId);

        Issue issue = new Issue();
        issue.setTitle(issueDto.getTitle());
        issue.setDescription(issueDto.getDescription());
        issue.setReportingUser(reportingUser);
        issue.setCreationDate(LocalDateTime.now());

        return convertToDto(issueRepository.save(issue));
    }

    @Transactional
    public IssueDto updateIssueStatus(Long issueId, IssueStatus newStatus) {
        Issue issue = findIssueOrThrow(issueId);
        issue.setStatus(newStatus);

        return convertToDto(issueRepository.save(issue));
    }

    @Transactional
    public IssueDto setIssueImage(Long issueId, String image) {
        Issue issue = findIssueOrThrow(issueId);
        issue.setImage(image);

        return convertToDto(issueRepository.save(issue));
    }

    @Transactional
    public IssueDto assignUserToIssue(Long issueId, Long assignedUserId) {
        Issue issue = findIssueOrThrow(issueId);
        User assignedUser = findUserOrThrow(assignedUserId);
        issue.setAssignedUser(assignedUser);

        return convertToDto(issueRepository.save(issue));
    }

    @Transactional
    public IssueDto addTagToIssue(Long issueId, Long tagId) {
        Issue issue = findIssueOrThrow(issueId);
        Tag tag = findTagOrThrow(tagId);

        issue.getTags().add(tag);

        return convertToDto(issueRepository.save(issue));
    }

    @Transactional(readOnly = true)
    public List<IssueDto> getAllIssue() {
        List<Issue> issues = issueRepository.findAll();

        return issues.stream().map(this::convertToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<IssueDto> getIssueToAssigned() {
        List<Issue> issues = issueRepository.getIssueByAssignedUserNull();

        return issues.stream().map(this::convertToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<IssueDto> getIssueWithPriority() {
        List<Issue> issues = issueRepository.getIssueByPriority(true);

        return issues.stream().map(this::convertToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<IssueDto> getIssueByReportingUserId(Long id) {
        List<Issue> issues = issueRepository.getIssueByReportingUserId(id);

        return issues.stream().map(this::convertToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<IssueDto> getIssueByAssignedUserId(Long id) {
        List<Issue> issues = issueRepository.getIssueByAssignedUserId(id);

        return issues.stream().map(this::convertToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<IssueDto> getIssueByType(IssueType type) {
        List<Issue> issues = issueRepository.getIssueByType(type);

        return issues.stream().map(this::convertToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<IssueDto> getIssueByTagsId (Long id) {
        List<Issue> issues = issueRepository.getIssueByTagsId(id);

        return issues.stream().map(this::convertToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<IssueDto> getIssueByStatus(IssueStatus status) {
        List<Issue> issues = issueRepository.getIssueByStatus(status);

        return issues.stream().map(this::convertToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<IssueDto> getIssueByCreationDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<Issue> issues = issueRepository.findByCreationDateRange(startDate, endDate);

        return issues.stream().map(this::convertToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<IssueDto> getIssueByLastModifiedDateRange(LocalDateTime startDate, LocalDateTime endDate) {
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

    private Tag findTagOrThrow(Long tagId) {
        return tagRepository.findById(tagId)
                .orElseThrow(() -> new EntityNotFoundException("Tag non trovato"));
    }

    private IssueDto convertToDto(Issue issue) {
        return IssueDto.builder().id(issue.getId())
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
