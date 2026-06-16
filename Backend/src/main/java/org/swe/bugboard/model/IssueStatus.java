package org.swe.bugboard.model;

public enum IssueStatus {
    TODO(true, true, true, true),
    INPROGRESS(true, true, true, true),
    RESOLVED(false, false, true, true),
    CLOSED(false, false, false, false);

    private final boolean isWorkload;
    private final boolean isSettable;
    private final boolean isModifiable;
    private final boolean isCloseable;

    IssueStatus(boolean isWorkload, boolean isSettable, boolean isModifiable, boolean isCloseable) {
        this.isWorkload = isWorkload;
        this.isSettable = isSettable;
        this.isModifiable = isModifiable;
        this.isCloseable = isCloseable;
    }

    public boolean isWorkload() {
        return isWorkload;
    }

    public boolean isSettable() { return isSettable; }

    public boolean isModifiable() {
        return isModifiable;
    }

    public boolean isCloseable() { return isCloseable; }
}
