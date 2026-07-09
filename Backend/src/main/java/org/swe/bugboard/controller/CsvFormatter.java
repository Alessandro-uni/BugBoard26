package org.swe.bugboard.controller;

import lombok.Getter;
import org.swe.bugboard.dto.issue.ExportSettings;
import org.swe.bugboard.dto.issue.IssueDetailsResponse;

import java.util.ArrayList;
import java.util.List;

@Getter
public class CsvFormatter {

    private String header;

    public CsvFormatter(ExportSettings.DetailLevel detailLevel){

        header = "";

        if (detailLevel.getLevel() >= ExportSettings.DetailLevel.LOW.getLevel()) {
            header += "Titolo;Utente segnalatore;Data creazione;Utente assegnato";

            if (detailLevel.getLevel() >= ExportSettings.DetailLevel.MEDIUM.getLevel()) {
                header += ";Data ultima modifica;Status;Priorità;Tipo";

                if (detailLevel.getLevel() >= ExportSettings.DetailLevel.HIGH.getLevel()) {
                    header += ";Descrizione;Etichette;Id";
                }
            }
        }
    }

    public String makeCsvRow(IssueDetailsResponse issue, ExportSettings.DetailLevel detailLevel) {
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

    private String wrapCsv(Object input) {
        if (input == null) {
            return "";
        }

        String s = String.valueOf(input);

        return "\"" + s.replace("\"", "\"\"") + "\"";
    }

    private void addLowDetails(IssueDetailsResponse issue, List<String> columns) {
        columns.add(wrapCsv(issue.getTitle()));
        columns.add(wrapCsv(issue.getReportingUserUsername()));
        columns.add(wrapCsv(issue.getCreationDate().toLocalDate()));
        columns.add(wrapCsv(issue.getAssignedUserUsername() == null ? "Non assegnata" : issue.getAssignedUserUsername()));
    }

    private void addMediumDetails(IssueDetailsResponse issue, List<String> columns) {
        columns.add(wrapCsv(issue.getLastModifiedDate().toLocalDate()));
        columns.add(wrapCsv(issue.getStatus()));
        columns.add(wrapCsv(issue.getPriority().equals(true) ? "Prioritario" : "Ordinario"));
        columns.add(wrapCsv(issue.getType()));
    }

    private void addHighDetails(IssueDetailsResponse issue, List<String> columns) {
        columns.add(wrapCsv(issue.getDescription()));

        String tagField = String.join(", ", issue.getTags());

        columns.add(wrapCsv(tagField));
        columns.add(wrapCsv(issue.getId()));
    }
}
