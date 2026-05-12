package org.swe.bugboard.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
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

        return convertModelToResponse(savedIssue);
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

        return convertModelToResponse(savedIssue);
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

        return convertModelToResponse(savedIssue);
    }

    @Transactional(readOnly = true)
    public List<IssueResponse> getAllIssue() {
        List<Issue> issues = issueRepository.findAll();

        return issues.stream().map(this::convertModelToResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<IssueResponse> getFilteredIssues(IssueRequest request){ //todo: rimpiazzare tutto questo con SQL dinamico se si riesce

        if(request.getId() != null){
            return issueRepository.findById(request.getId()).stream().map(this::convertModelToResponse).toList();
        }

        Specification<Issue> specification = Specification.unrestricted();

        if(request.getAssignedUserId() != null) {
            if(request.getAssignedUserId() == -1){
                specification = specification.and(IssueSpecification.hasNoAssignedUser());
            }else{
                specification = specification.and(IssueSpecification.hasAssignedUser(request.getAssignedUserId()));
            }
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

        if(request.getTags() != null){
            specification = specification.and(IssueSpecification.hasTags(request.getTags()));
        }


        return issueRepository.findAll(specification).stream().map(this::convertModelToResponse).toList();

        /*
        class FilteredIssues{
            List<Issue> issueList= null;

            private void getIssuesToBeAssigned() {
                if (issueList == null) {
                    issueList = issueRepository.getIssueByAssignedUserNull();
                } else {
                    issueList = issueList.stream().filter(issue -> issue.getAssignedUser() == null).toList();
                }
            }

            private void filterByAssignerUser() {
                Long id = request.getAssignedUserId();

                if (id == null) { //Filtro non chiede un assignedUser specifico
                    return;
                }

                if (id == -1) { //todo: ricorda di metterlo così nel frontend (richiesta di issues senza user assegnato)
                    getIssuesToBeAssigned();
                    return;
                }

                if (issueList == null) {
                    issueList = issueRepository.getIssueByAssignedUserId(id);
                } else {
                    issueList = issueList.stream().filter(issue -> Objects.equals(issue.getReportingUser().getId(), id)).toList();
                }
            }

            private void filterByReportingUser() {
                Long id = request.getReportingUserId();

                if (id == null) { //Filtro non chiede un reportinUser specifico
                    return;
                }

                if (issueList == null) {
                    issueList = issueRepository.getIssueByReportingUserId(id);
                } else {
                    issueList = issueList.stream().filter(issue -> Objects.equals(issue.getReportingUser().getId(), id)).toList();
                }
            }

            private void filterByPriority() {
                Boolean priority = request.getPriority();

                if (priority == null) { //Filtro non chiede una priority specifica
                    return;
                }

                if (issueList == null) {
                    issueList = issueRepository.getIssueByPriority(priority);
                } else {
                    issueList = issueList.stream().filter(issue -> Objects.equals(issue.getPriority(), priority)).toList();
                }
            }

            private void filterByIssueType() {

                if (request.getType() == null) { //Filtro non chiede un issueType specifico
                    return;
                }

                IssueType.valueOf(null);

                IssueType issueType = IssueType.valueOf(request.getType().toUpperCase());

                if (issueList == null) {
                    issueList = issueRepository.getIssueByType(issueType);
                } else {
                    issueList = issueList.stream().filter(issue -> issue.getType().equals(issueType)).toList();
                }
            }

            private void filterByTags() {
                if (request.getTags() == null) { //Filtro non chiede un set di Tag specifici
                    return;
                }

                if (issueList == null) {
                    if(request.getTags().isEmpty()){ //Filtro chiede specificamente le issue senza tag
                        issueList = issueRepository.findIssuesWithNoTags();
                    } else {
                        for (String s : request.getTags()) {
                            issueList = new ArrayList<>();
                            issueList.addAll(issueRepository.getIssueByTagsName(s));
                        }
                    }
                } else { //Sbagliato, dovrebbe vedere che tags è un subset di issue.getTags, non che siano uguali
                    Set<Tag> tags = tagRepository.findByNameIn(request.getTags());
                    issueList = issueList.stream().filter(issue -> issue.getTags().equals(tags)).toList();
                }
            }

            private void filterByIssueStatus() {
                if (request.getStatus() == null) { //Filtro non chiede un issueStatus specifico
                    return;
                }

                IssueStatus issueStatus = IssueStatus.valueOf(request.getStatus());

                if (issueList == null) {
                    issueList = issueRepository.getIssueByStatus(issueStatus);
                } else {
                    issueList = issueList.stream().filter(issue -> issue.getStatus() == issueStatus).toList();
                }
            }

            private void filterByCreationDateRange() {
                LocalDateTime start = request.getStartCreationDate();
                LocalDateTime end = request.getEndCreationDate();

                if (start == null && end == null) { //Filtro non chiede un range specifico
                    return;
                }

                if (issueList == null) {
                    issueList = issueRepository.findByCreationDateRange(start, end);
                } else {
                    issueList = issueList.stream()
                            .filter(issue -> (issue.getCreationDate().isAfter(start) && issue.getCreationDate().isBefore(end)))
                            .toList();
                }
            }

            private void filterByLastModifiedDateRange() {
                LocalDateTime start = request.getStartLastModifiedDate();
                LocalDateTime end = request.getEndLastModifiedDate();

                if (start == null && end == null) { //Filtro non chiede un range specifico
                    return;
                }

                if (issueList == null) {
                    issueList = issueRepository.findByLastModifiedDateRange(start, end);
                } else {
                    issueList = issueList.stream()
                            .filter(issue -> (issue.getLastModifiedDate().isAfter(start) && issue.getLastModifiedDate().isBefore(end)))
                            .toList();
                }
            }
        }

        FilteredIssues f = new FilteredIssues();

        if (request.getId() != null) {
            if (request.getId() == -1) {
                return getAllIssue();
            }

            f.issueList = issueRepository.findById(request.getId()).stream().toList();

        } else {
            f.filterByCreationDateRange();
            f.filterByLastModifiedDateRange();
            f.filterByIssueStatus();
            f.filterByIssueType();
            f.filterByPriority();
            f.filterByAssignerUser();
            f.filterByReportingUser();
            f.filterByTags();
        }

        return f.issueList.stream().map(this::convertModelToResponse).toList();*/
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
