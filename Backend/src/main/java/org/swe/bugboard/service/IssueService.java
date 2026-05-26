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
import org.swe.bugboard.dto.Issue.*;
import org.swe.bugboard.specification.IssueSpecification;
import org.swe.bugboard.dto.History.HistoryRequest;
import org.swe.bugboard.dto.User.UserRequest;
import org.swe.bugboard.model.*;
import org.swe.bugboard.repository.IssueRepository;
import org.swe.bugboard.repository.TagRepository;
import org.swe.bugboard.repository.UserRepository;

import java.io.IOException;
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

    @Transactional
    public IssueResponse createIssue(ReportIssueRequest reportIssueRequest, UserRequest userRequest, MultipartFile file) {
        User reportingUser = findUserOrThrow(userRequest.getId());

        Set<Tag> tags = tagRepository.findByNameIn(reportIssueRequest.getTags());

        IssueImage image = null;

        if(file != null && !file.isEmpty()){
            String extension = Objects.requireNonNull(file.getContentType()).substring(file.getContentType().lastIndexOf('/') + 1);
            String storedName = UUID.randomUUID() + "." + extension;

            try{
                image = IssueImage.builder()
                        .rawImage(file.getBytes())
                        .name(storedName).build();
            } catch (IOException e) {
                throw new RuntimeException("Could not save file");
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

        HistoryRequest historyRequest = new HistoryRequest(savedIssue.getId(), "Segnalata issue");
        historyService.createHistory(historyRequest, userRequest);

        return convertModelToIssueResponse(savedIssue);
    }

    @Transactional
    public IssueResponse updateIssueStatus(UpdateIssueRequest updateIssueRequest, UserRequest userRequest) {
        User assignedUser = findUserOrThrow(userRequest.getId());
        Issue issue = findIssueOrThrow(updateIssueRequest.getId());

        if (issue.getAssignedUser() == null) {
            throw new AccessDeniedException("Nessun utente assegnato a questa issue");
        }

        if (!Objects.equals(assignedUser.getId(), issue.getAssignedUser().getId())) {
            throw new AccessDeniedException("Utente non abilitato a modificare lo stato di questa issue");
        }

        IssueStatus oldStatus = issue.getStatus();
        IssueStatus newStatus = findStatusOrThrow(updateIssueRequest.getNewStatus());

        if (oldStatus == newStatus) {
            throw new IllegalStateException("La issue si trova già nello stato: " + oldStatus.name());
        }

        if (oldStatus == IssueStatus.RESOLVED || oldStatus == IssueStatus.CLOSED) {
            throw new IllegalStateException("Impossibile modificare lo stato di una Issue che si trova nello stato '" + oldStatus.name() + "'");
        }

        if (newStatus == IssueStatus.TODO) {
            throw new IllegalStateException("Impossibile modificare lo stato di una Issue in '" + updateIssueRequest.getNewStatus() + "'");
        }

        issue.setStatus(newStatus);

        Issue savedIssue = issueRepository.save(issue);

        HistoryRequest historyRequest = new HistoryRequest(savedIssue.getId(), "Stato aggiornato in: " + savedIssue.getStatus());
        historyService.createHistory(historyRequest, userRequest);

        return convertModelToIssueResponse(savedIssue);
    }

    @Transactional
    public IssueResponse closeIssue(UpdateIssueRequest closeIssueRequest, UserRequest userRequest) {
        Issue issue = findIssueOrThrow(closeIssueRequest.getId());

        if (issue.getStatus().equals(IssueStatus.CLOSED)) {
            throw new IllegalStateException("La issue si trova già nello stato: " + issue.getStatus().name());
        }

        issue.setStatus(IssueStatus.CLOSED);

        Issue savedIssue = issueRepository.save(issue);

        HistoryRequest historyRequest = new HistoryRequest(savedIssue.getId(), "La issue è stata chiusa poiché ritenuta duplicata ");
        historyService.createHistory(historyRequest, userRequest);

        return convertModelToIssueResponse(savedIssue);
    }

    @Transactional
    public IssueResponse assignUserToIssue(UpdateIssueRequest issueRequest, UserRequest userToAssign, UserRequest userRequest) {
        Issue issue = findIssueOrThrow(issueRequest.getId());

        if (issue.getAssignedUser() != null) {
            throw new IllegalStateException("Issue già assegnata all'utente: " + issue.getAssignedUser().getUsername());
        }

        if (!issue.getStatus().equals(IssueStatus.TODO)) {
            throw new IllegalStateException("Impossibile assegnare questa issue, si trova già nello stato: " + issue.getStatus().name());
        }

        User assignedUser = findUserOrThrow(userToAssign.getId());
        issue.setAssignedUser(assignedUser);

        Issue savedIssue = issueRepository.save(issue);

        HistoryRequest historyRequest = new HistoryRequest(savedIssue.getId(), "Issue assegnata all'utente: " + savedIssue.getAssignedUser().getUsername());
        historyService.createHistory(historyRequest, userRequest);

        return convertModelToIssueResponse(savedIssue);
    }

    @Transactional(readOnly = true)
    public IssueResponse getIssueById(Long issueId) {
        return convertModelToIssueResponse(findIssueOrThrow(issueId));
    }

    @Transactional(readOnly = true)
    public Page<IssuePreviewResponse> getFilteredIssues(IssuePageRequest request){

        /* A null value represents the fact that the filter for that value is not requested
         * If the filter for the absence of a value can exist it is specified by a comment
         */

        Specification<Issue> specification = Specification.unrestricted(); //Makes it possible to fetch all issues with an empty filter request

        if(request.getAssignedUserId() != null) {
            specification = specification.and(IssueSpecification.hasAssignedUser(request.getAssignedUserId()));
        } else if(request.getIsAssigned() != null){
            specification = specification.and(IssueSpecification.hasAssignedUser(request.getIsAssigned()));
        }

        if(request.getReportingUserId() != null){
            specification = specification.and(IssueSpecification.hasReportingUser(request.getReportingUserId()));
        }

        if(request.getPriority() != null){
            specification = specification.and(IssueSpecification.hasPriority(request.getPriority()));
        }

        if(request.getStatus() != null){
            specification = specification.and(IssueSpecification.hasStatus(request.getStatus()));
        }

        if(request.getType() != null){
            specification = specification.and(IssueSpecification.hasType(request.getType()));
        }

        if(request.getStartCreationDate() != null){
            specification = specification.and(IssueSpecification.hasCreationDateAfter(request.getStartCreationDate()));
        }
        if(request.getEndCreationDate() != null){
            specification = specification.and(IssueSpecification.hasCreationDateBefore(request.getEndCreationDate()));
        }

        if(request.getStartLastModifiedDate() != null){
            specification = specification.and(IssueSpecification.hasLastModifiedDateAfter(request.getStartLastModifiedDate()));
        }
        if(request.getEndLastModifiedDate() != null){
            specification = specification.and(IssueSpecification.hasLastModifiedDateBefore(request.getEndLastModifiedDate()));
        }

        if(request.getHasTags() != null){
            specification = specification.and(IssueSpecification.hasTags(request.getHasTags()));
        }else if(request.getTags() != null){
            specification = specification.and(IssueSpecification.containsTags(request.getTags()));
        }

        if(request.getHasImage() != null){
            specification = specification.and(IssueSpecification.hasImage(request.getHasImage()));
        }

        Sort sortingType;

        // Verifica che il sort type sia stato inserito (non è null), altrimenti usa CREATION_DATE_DESCENDING come default
        IssueSortType type = request.getSortType() != null ? request.getSortType() : IssueSortType.CREATION_DATE_DESCENDING;

        switch (type) {
            case CREATION_DATE_ASCENDING -> sortingType = Sort.by("creationDate").ascending();
            case LAST_MODIFIED_DATE_ASCENDING -> sortingType = Sort.by("lastModifiedDate").ascending();
            case LAST_MODIFIED_DATE_DESCENDING -> sortingType = Sort.by("lastModifiedDate").descending();
            default -> sortingType = Sort.by("creationDate").descending(); //CREATION_DATE_DESCENDING
        }

        return issueRepository.findAll(specification,
                PageRequest.of(request.getPageNumber(), request.getPageSize(), sortingType)).map(this::convertModelToIssuePreviewResponse);
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

    private IssueResponse convertModelToIssueResponse(Issue issue) {
        IssueImageResponse imageResponse = null;

        if (issue.getImage() != null) {
            imageResponse = IssueImageResponse.builder()
                    .name(issue.getImage().getName())
                    .rawImage(issue.getImage().getRawImage()).build();
        }

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

    private IssuePreviewResponse convertModelToIssuePreviewResponse(Issue issue) {

        return IssuePreviewResponse.builder().id(issue.getId())
                .title(issue.getTitle())
                .description(issue.getDescription())
                .type(issue.getType().name())
                .status(issue.getStatus().name())
                .priority(issue.getPriority())
                .build();
    }

    // Debugging
    @Transactional(readOnly = true)
    public List<IssueResponse> getAllIssue() {
        List<Issue> issues = issueRepository.findAll();

        return issues.stream().map(this::convertModelToIssueResponse).toList();
    }
}
