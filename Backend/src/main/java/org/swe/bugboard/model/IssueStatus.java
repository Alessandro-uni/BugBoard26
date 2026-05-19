package org.swe.bugboard.model;

public enum IssueStatus {
    TODO(true, true),
    INPROGRESS(true, true),
    RESOLVED(false, true),
    CLOSED(false, false);

    private final boolean isWorkload;
    private final boolean isModifiable;

    IssueStatus(boolean isWorkload, boolean isModifiable) {
        this.isWorkload = isWorkload;
        this.isModifiable = isModifiable;
    }

    public boolean isWorkload() {
        return isWorkload;
    }

    public boolean isModifiable() {
        return isModifiable;
    }
}
