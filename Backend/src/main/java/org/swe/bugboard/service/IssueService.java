package org.swe.bugboard.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.swe.bugboard.dto.issue.*;
import org.swe.bugboard.specification.IssueSpecification;
import org.swe.bugboard.dto.history.HistoryRequest;
import org.swe.bugboard.model.*;
import org.swe.bugboard.repository.IssueRepository;
import org.swe.bugboard.repository.TagRepository;
import org.swe.bugboard.repository.UserRepository;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IssueService {
    private static final int DEFAULT_PAGE_NUMBER = 0;
    private static final int DEFAULT_PAGE_SIZE = 25;
    
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final HistoryService historyService;
    private final NotificationService notificationService;

    @Transactional
    public IssueDetailsResponse createIssue(ReportIssueRequest reportIssueRequest, Long currentUserId, MultipartFile file) {
        User reportingUser = findUserOrThrow(currentUserId);

        Set<Tag> tags = tagRepository.findByNameIn(reportIssueRequest.getTags());

        IssueImage image = null;

        if (file != null && !file.isEmpty()) {
            String extension = Objects.requireNonNull(file.getContentType()).substring(Objects.requireNonNull(file.getContentType()).lastIndexOf('/') + 1);
            String storedName = UUID.randomUUID() + "." + extension;

            try{
                image = IssueImage.builder()
                        .rawImage(file.getBytes())
                        .name(storedName).build();
            } catch (IOException e) {
                throw new UncheckedIOException("Could not save file", e);
            }
        }

        Issue issue = Issue.builder()
                .title(reportIssueRequest.getTitle())
                .description(reportIssueRequest.getDescription())
                .type(IssueType.valueOf(reportIssueRequest.getType()))
                .status(IssueStatus.TODO)
                .priority(reportIssueRequest.getPriority())
                .tags(tags)
                .image(image)
                .creationDate(LocalDateTime.now())
                .lastModifiedDate(LocalDateTime.now())
                .reportingUser(reportingUser)
                .assignedUser(null).build();

        Issue savedIssue = issueRepository.save(issue);

        HistoryRequest historyRequest = new HistoryRequest(savedIssue.getId(), "ha segnalato la issue");
        historyService.createHistory(historyRequest, currentUserId);

        return convertModelToIssueDetails(savedIssue);
    }

    @Transactional
    public IssueDetailsResponse updateIssueStatus(UpdateIssueRequest updateIssueRequest, Long userId) {
        User assignedUser = findUserOrThrow(userId);
        Issue issue = findIssueOrThrow(updateIssueRequest.getIssueId());

        if (issue.getAssignedUser() == null) {
            throw new AccessDeniedException("Nessun utente assegnato a questa issue");
        }

        if (!Objects.equals(assignedUser.getId(), issue.getAssignedUser().getId())) {
            throw new AccessDeniedException("Utente non abilitato a modificare lo stato di questa issue");
        }

        IssueStatus oldStatus = issue.getStatus();
        IssueStatus newStatus = findStatusOrThrow(updateIssueRequest.getNewStatus());

        if (oldStatus == newStatus) {
            return null;
        }

        if (!oldStatus.isModifiable()) {
            throw new IllegalStateException("Impossibile modificare lo stato di una Issue che si trova nello stato '" + oldStatus.name() + "'");
        }

        if (!newStatus.isSettable()) {
            throw new IllegalStateException("Impossibile modificare lo stato di una Issue in '" + newStatus.name() + "'");
        }

        issue.setStatus(newStatus);

        Issue savedIssue = issueRepository.save(issue);

        if(newStatus.equals(IssueStatus.RESOLVED)){
            notificationService.createNotification(issue);
        }

        HistoryRequest historyRequest = new HistoryRequest(savedIssue.getId(), "ha aggiornato lo stato in " + savedIssue.getStatus());
        historyService.createHistory(historyRequest, userId);

        return convertModelToIssueDetails(savedIssue);
    }

    @Transactional
    public IssueDetailsResponse closeIssue(UpdateIssueRequest closeIssueRequest, Long userId) {
        Issue issue = findIssueOrThrow(closeIssueRequest.getIssueId());

        if (issue.getStatus().equals(IssueStatus.CLOSED)) {
            return convertModelToIssueDetails(issue);
        }

        if (!issue.getStatus().isCloseable()) {
            throw new IllegalStateException("Impossibile chiudere una Issue che si trova nello stato '" + issue.getStatus().name() + "'");
        }

        issue.setStatus(IssueStatus.CLOSED);

        Issue savedIssue = issueRepository.save(issue);

        HistoryRequest historyRequest = new HistoryRequest(savedIssue.getId(), "ha chiuso questa issue perché ritenuta duplicata");
        historyService.createHistory(historyRequest, userId);

        return convertModelToIssueDetails(savedIssue);
    }

    @Transactional
    public IssueDetailsResponse assignUserToIssue(Long issueId, Long userId, Long currentUserId) {
        Issue issue = findIssueOrThrow(issueId);

        if (issue.getAssignedUser() != null) {
            if (issue.getAssignedUser().getId().equals(userId)) {
                return convertModelToIssueDetails(issue);
            }

            throw new IllegalStateException("Attenzione, questa issue è già stata assegnata all'utente: " + issue.getAssignedUser().getUsername());
        }

        if (!issue.getStatus().equals(IssueStatus.TODO)) {
            throw new IllegalStateException("Impossibile assegnare questa issue, si trova già nello stato: " + issue.getStatus().name());
        }

        User assignedUser = findUserOrThrow(userId);
        issue.setAssignedUser(assignedUser);

        Issue savedIssue = issueRepository.save(issue);

        HistoryRequest historyRequest = new HistoryRequest(savedIssue.getId(), "ha assegnato la issue a " + savedIssue.getAssignedUser().getUsername());
        historyService.createHistory(historyRequest, currentUserId);

        return convertModelToIssueDetails(savedIssue);
    }

    @Transactional(readOnly = true)
    public IssueDetailsResponse getIssueById(Long issueId) {
        return convertModelToIssueDetails(findIssueOrThrow(issueId));
    }

    @Transactional(readOnly = true)
    public Page<IssuePreviewResponse> getIssuePage(IssuePageRequest request) {

        Specification<Issue> specification = buildSpecification(request.getFilters());

        PageRequest pageRequest = buildPageRequest(request.getPageInformation(), request.getSortType());

        return issueRepository.findAll(specification, pageRequest).map(this::convertModelToIssuePreview);

    }

    @Transactional(readOnly = true)
    public List<IssueDetailsResponse> getDetailedIssuesList(IssuePageRequest request) {

        if (request == null) {
            return issueRepository.findAll(IssueSortingPolicy.DEFAULT.getSortingPolicy()).stream().map(this::convertModelToIssueDetails).toList();
        }

        Specification<Issue> specification = buildSpecification(request.getFilters());

        if (request.getPageInformation() == null) {
            Sort sort = request.getSortType() == null ? IssueSortingPolicy.DEFAULT.getSortingPolicy() : request.getSortType().getSortingPolicy();
            return issueRepository.findAll(specification, sort).stream().map(this::convertModelToIssueDetails).toList();
        }

        PageRequest pageRequest = buildPageRequest(request.getPageInformation(), request.getSortType());
        return issueRepository.findAll(specification, pageRequest).map(this::convertModelToIssueDetails).stream().toList();
    }

    private PageRequest buildPageRequest(PageInformation pageInformation, IssueSortingPolicy sortType) {

        int pageNumber;
        int pageSize;

        if (pageInformation == null) {
            pageNumber = DEFAULT_PAGE_NUMBER;
            pageSize = DEFAULT_PAGE_SIZE;
        } else {
            pageNumber = pageInformation.getPageNumber();
            pageSize = pageInformation.getPageSize();
        }

        Sort sortingPolicy = sortType == null ? IssueSortingPolicy.DEFAULT.getSortingPolicy() : sortType.getSortingPolicy();

        return PageRequest.of(pageNumber, pageSize, sortingPolicy);
    }

    private Specification<Issue> buildSpecification(IssueFilters filter) {

        Specification<Issue> specification = Specification.unrestricted(); //Makes it possible to fetch all issues with an empty filter request

        if (filter == null) return specification; //fail fast

        return specification
                .and(IssueSpecification.hasAssignedUser(filter.getAssignedUserId()))
                .and(IssueSpecification.isAssigned(filter.getIsAssigned()))
                .and(IssueSpecification.hasReportingUser(filter.getReportingUserId()))
                .and(IssueSpecification.hasPriority(filter.getPriority()))
                .and(IssueSpecification.hasStatus(filter.getStatus()))
                .and(IssueSpecification.isAssignable(filter.getIsAssignable()))
                .and(IssueSpecification.hasType(filter.getType()))
                .and(IssueSpecification.hasCreationDateAfter(filter.getStartCreationDate()))
                .and(IssueSpecification.hasCreationDateBefore(filter.getEndCreationDate()))
                .and(IssueSpecification.hasLastModifiedDateAfter(filter.getStartLastModifiedDate()))
                .and(IssueSpecification.hasLastModifiedDateBefore(filter.getEndLastModifiedDate()))
                .and(IssueSpecification.isTagged(filter.getIsTagged()))
                .and(IssueSpecification.containsTags(filter.getTags()))
                .and(IssueSpecification.hasImage(filter.getHasImage()));
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

    private IssueDetailsResponse convertModelToIssueDetails(Issue issue) {
        IssueImageResponse imageResponse = null;

        if (issue.getImage() != null) {
            imageResponse = IssueImageResponse.builder()
                    .name(issue.getImage().getName())
                    .rawImage(issue.getImage().getRawImage()).build();
        }

        return IssueDetailsResponse.builder().id(issue.getId())
                .title(issue.getTitle())
                .description(issue.getDescription())
                .type(issue.getType().name())
                .status(issue.getStatus())
                .priority(issue.getPriority())
                .tags(
                        Optional.ofNullable(issue.getTags())
                                .orElse(Collections.emptySet())
                                .stream()
                                .map(Tag::getName)
                                .collect(Collectors.toSet())
                )
                .image(imageResponse)
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

    private IssuePreviewResponse convertModelToIssuePreview(Issue issue) {

        return IssuePreviewResponse.builder().id(issue.getId())
                .title(issue.getTitle())
                .description(issue.getDescription())
                .type(issue.getType().name())
                .status(issue.getStatus())
                .priority(issue.getPriority())
                .build();
    }

    // Debugging
    @Transactional(readOnly = true)
    public List<IssueDetailsResponse> getAllIssue() {
        List<Issue> issues = issueRepository.findAll();

        return issues.stream().map(this::convertModelToIssueDetails).toList();
    }
}
