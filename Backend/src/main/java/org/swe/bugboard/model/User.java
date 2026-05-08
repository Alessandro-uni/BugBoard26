package org.swe.bugboard.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "BugBoardUser")

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true,
            nullable = false
    )
    private String mail;

    @Column(nullable = false)
    private String hashedPassword;

    @Column(unique = true,
            nullable = false
    )
    private String username;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @OneToMany(mappedBy = "reportingUser",
            fetch = FetchType.LAZY
    )
    private Set<Issue> reportedIssues;

    @OneToMany(mappedBy = "assignedUser",
            fetch = FetchType.LAZY
    )
    private Set<Issue> assignedIssues;
}