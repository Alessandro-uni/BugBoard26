package org.swe.bugboard.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.web.PagedModel;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.swe.bugboard.dto.issue.*;
import org.swe.bugboard.model.IssueStatus;
import org.swe.bugboard.model.IssueType;
import org.swe.bugboard.service.IssueService;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.frontend.url}")
public class IssueController {
    private final IssueService issueService;

    private static final String USER_ID_CLAIM = "userId";

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('REPORT_ISSUE')")
    public ResponseEntity<IssueDetailsResponse> reportIssue(@AuthenticationPrincipal Jwt jwt,
                                                            @Valid @RequestPart("data") ReportIssueRequest reportIssueRequest,
                                                            @RequestPart(value = "file", required = false) MultipartFile file) {
        Long currentUserId = jwt.getClaim(USER_ID_CLAIM);


        IssueDetailsResponse response = issueService.createIssue(reportIssueRequest, currentUserId, file);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/exportCSV")
    public void exportIssues(HttpServletResponse response,
                             @Valid @RequestBody ExportSettings settings) throws IOException {

        response.setContentType("text/csv; charset=UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=\"issues.csv\"");

        try (PrintWriter writer = response.getWriter()) {
            writer.println(getCSVHeader(settings.getDetailLevel()));

            try {
                List<IssueDetailsResponse> issueList = issueService.getDetailedIssuesList(settings.getIssuePageRequest());
                for (IssueDetailsResponse issue : issueList) {
                    writer.println(getCSVRow(issue, settings.getDetailLevel()));
                }
            } catch (Exception e) {
                System.err.println("Errore durante l'esportazione issue: ");
                e.printStackTrace();
            }

        }
    }

    private String getCSVHeader(ExportSettings.DetailLevel detailLevel) {
        String header = "";

        if (detailLevel.getLevel() >= ExportSettings.DetailLevel.LOW.getLevel()) {
            header += "Titolo;Utente segnalatore;Data creazione;Utente assegnato";

            if (detailLevel.getLevel() >= ExportSettings.DetailLevel.MEDIUM.getLevel()) {
                header += ";Data ultima modifica;Status;Priorità;Tipo";

                if (detailLevel.getLevel() >= ExportSettings.DetailLevel.HIGH.getLevel()) {
                    header += ";Descrizione;Etichette;Id";
                }
            }
        }

        return header;
    }

    private String getCSVRow(IssueDetailsResponse issue, ExportSettings.DetailLevel detailLevel) {
        List<String> columns = new ArrayList<>();
        int levelDetail = detailLevel.getLevel();

        if (levelDetail >= ExportSettings.DetailLevel.LOW.getLevel()) {
            addLowDetails(issue, columns);
        }

        if (levelDetail >= ExportSettings.DetailLevel.MEDIUM.getLevel()) {
            addMediumDetails(issue, columns);
        }

        if (levelDetail >= ExportSettings.DetailLevel.HIGH.getLevel()) {
            addHighDetails(issue, columns);
        }

        return String.join(";", columns);
    }

    private String wrapCSV(Object input) {
        if (input == null) {
            return "";
        }

        String s = String.valueOf(input);

        return "\"" + s.replace("\"", "\"\"") + "\"";
    }

    private void addLowDetails(IssueDetailsResponse issue, List<String> columns) {
        columns.add(wrapCSV(issue.getTitle()));
        columns.add(wrapCSV(issue.getReportingUserUsername()));
        columns.add(wrapCSV(issue.getCreationDate().toLocalDate()));
        columns.add(wrapCSV(issue.getAssignedUserUsername() == null ? "Non assegnata" :issue.getAssignedUserUsername()));
    }

    private void addMediumDetails(IssueDetailsResponse issue, List<String> columns) {
        columns.add(wrapCSV(issue.getLastModifiedDate().toLocalDate()));
        columns.add(wrapCSV(issue.getStatus()));
        columns.add(wrapCSV(issue.getPriority().equals(true) ? "Prioritario" : "Ordinario"));
        columns.add(wrapCSV(issue.getType()));
    }

    private void addHighDetails(IssueDetailsResponse issue, List<String> columns) {
        columns.add(wrapCSV(issue.getDescription()));

        String tagField = String.join(", ", issue.getTags());

        columns.add(wrapCSV(tagField));
        columns.add(wrapCSV(issue.getId()));
    }

    @GetMapping("/{issueId}")
    public ResponseEntity<IssueDetailsResponse> findIssueById(@PathVariable Long issueId) {
        IssueDetailsResponse response = issueService.getIssueById(issueId);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/status")
    @PreAuthorize("hasAuthority('BE_ASSIGNED_TO_ISSUE')")
    public ResponseEntity<IssueDetailsResponse> updateIssueStatus(@AuthenticationPrincipal Jwt jwt,
                                                                  @Valid @RequestBody UpdateIssueRequest updateIssueRequest) {
        Long currentUserId = jwt.getClaim(USER_ID_CLAIM);

        IssueDetailsResponse response = issueService.updateIssueStatus(updateIssueRequest, currentUserId);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/close")
    @PreAuthorize("hasAuthority('CLOSE_ISSUE')")
    public ResponseEntity<IssueDetailsResponse> closeIssue(@AuthenticationPrincipal Jwt jwt,
                                                           @Valid @RequestBody UpdateIssueRequest updateIssueRequest) {
        Long currentUserId = jwt.getClaim(USER_ID_CLAIM);

        IssueDetailsResponse response = issueService.closeIssue(updateIssueRequest, currentUserId);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/assign")
    @PreAuthorize("hasAuthority('ASSIGN_ISSUE')")
    public ResponseEntity<IssueDetailsResponse> assignIssue(@AuthenticationPrincipal Jwt jwt,
                                                            @Valid @RequestBody AssignIssueToUserRequest issueAndUserRequest) {
        Long currentUserId = jwt.getClaim(USER_ID_CLAIM);

        IssueDetailsResponse response = issueService.assignUserToIssue(issueAndUserRequest.getIssueId(), issueAndUserRequest.getUserId(), currentUserId);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/search")
    public PagedModel<IssuePreviewResponse> filterAndSortIssues(@Valid @RequestBody IssuePageRequest pageRequest) {

        return new PagedModel<>(issueService.getIssuePage(pageRequest));
    }

    @GetMapping("/types")
    public ResponseEntity<List<String>> getAllIssueTypes() {
        List<String> response = Arrays.stream(IssueType.values())
                                        .map(Enum::name)
                                        .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/statuses")
    public ResponseEntity<List<IssueStatus>> getAllIssueStatus() {
        List<IssueStatus> response = Arrays.asList(IssueStatus.values());

        return ResponseEntity.ok(response);
    }

    //Debugging
    @GetMapping
    public ResponseEntity<List<IssueDetailsResponse>> viewAllIssues() {
        List<IssueDetailsResponse> response = issueService.getAllIssue();

        return ResponseEntity.ok(response);
    }
}
