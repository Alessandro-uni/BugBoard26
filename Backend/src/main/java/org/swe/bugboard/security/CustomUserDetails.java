package org.swe.bugboard.security;

import org.jspecify.annotations.NullMarked;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.swe.bugboard.model.User;
import org.swe.bugboard.model.UserRole;

import java.util.Collection;

public record CustomUserDetails(User user) implements UserDetails {
    public Long getId() {
        return user.getId();
    }

    public UserRole getRole() {
        return user.getRole();
    }

    public String getName() {
        return user.getUsername();
    }

    @Override
    @NullMarked
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getRole().getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.name()))
                .toList();
    }

    @Override
    @NullMarked
    public String getUsername() { // Viene chiamato anche con getName()
        return user.getMail(); // Restituisce l'identificativo dello User, ovvero la mail
    }

    @Override
    public String getPassword() {
        return user.getHashedPassword();
    }
}