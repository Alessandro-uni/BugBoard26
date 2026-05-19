package org.swe.bugboard.model;

public enum UserRole {
    USER(true, true),
    ADMIN(true, true),
    LURKER(false, false);

    private final boolean canReportIssue;
    private final boolean canBeAssignedToIssue;

    UserRole(boolean canReportIssue, boolean canBeAssignedToIssue) {
        this.canReportIssue = canReportIssue;
        this.canBeAssignedToIssue = canBeAssignedToIssue;
    }

    public boolean canReportIssue() {
        return canReportIssue;
    }

    public boolean canBeAssignedToIssue() {
        return canBeAssignedToIssue;
    }
}
