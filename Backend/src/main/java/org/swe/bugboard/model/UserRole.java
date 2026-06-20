package org.swe.bugboard.model;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Collections;
import java.util.EnumSet;
import java.util.Set;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum UserRole {
    USER(EnumSet.of(
            RolePermission.REPORT_ISSUE,
            RolePermission.BE_ASSIGNED_TO_ISSUE
    )),

    ADMIN(EnumSet.of(
            RolePermission.REPORT_ISSUE,
            RolePermission.BE_ASSIGNED_TO_ISSUE,
            RolePermission.ASSIGN_ISSUE,
            RolePermission.CLOSE_ISSUE,
            RolePermission.CREATE_USERS
    )),

    LURKER(Collections.emptySet());

    private final Set<RolePermission> permissions;

    UserRole(Set<RolePermission> permissions) {
        this.permissions = Collections.unmodifiableSet(permissions);
    }

    public Set<RolePermission> getPermissions() {
        return permissions;
    }

    public boolean hasPermission(RolePermission permission) {
        return permissions.contains(permission);
    }

    public String getName() { return this.name(); }
}
