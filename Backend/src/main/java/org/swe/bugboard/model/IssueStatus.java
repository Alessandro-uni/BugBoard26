package org.swe.bugboard.model;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Arrays;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum IssueStatus {
    TODO(Feature.WORKLOAD, Feature.SETTABLE, Feature.MODIFIABLE, Feature.CLOSEABLE, Feature.ASSIGNABLE),
    INPROGRESS(Feature.WORKLOAD, Feature.SETTABLE, Feature.MODIFIABLE, Feature.CLOSEABLE),
    RESOLVED(Feature.SETTABLE, Feature.MODIFIABLE, Feature.CLOSEABLE),
    CLOSED();

    // Enum interno con le caratteristiche degli stati
    public enum Feature {
        WORKLOAD,
        SETTABLE,
        MODIFIABLE,
        CLOSEABLE,
        ASSIGNABLE
    }

    private final Set<Feature> features;

    IssueStatus(Feature... features) {
        if (features.length == 0) {
            this.features = EnumSet.noneOf(Feature.class);
        } else {
            this.features = EnumSet.copyOf(Arrays.asList(features));
        }
    }

    public boolean isWorkload() {
        return features.contains(Feature.WORKLOAD);
    }

    public boolean isSettable() {
        return features.contains(Feature.SETTABLE);
    }

    public boolean isModifiable() {
        return features.contains(Feature.MODIFIABLE);
    }

    public boolean isCloseable() {
        return features.contains(Feature.CLOSEABLE);
    }

    public boolean isAssignable() {
        return features.contains(Feature.ASSIGNABLE);
    }

    public static List<IssueStatus> getAssignableStatuses() {
        return Arrays.stream(values())
                .filter(IssueStatus::isAssignable)
                .toList();
    }

    public String getName() {
        return this.name();
    }
}
