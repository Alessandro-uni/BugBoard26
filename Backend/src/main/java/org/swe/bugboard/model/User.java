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

    @Column(unique = true,
            nullable = false
    )
    private String username; //todo: considerare se usare lo username o se usare la prima parte della mail (e.g. nome.cognome@mail.net -> nome.cognome)

    @Column(nullable = false) //todo: capisci come mettere una check per vedere che sia effettivamente "Admin" o "User" (se usiamo questo metodo)
    private String role; //todo: considerare il tipo di questa variabile o se usare la gerarchia e il .class/getClass()

    @OneToMany(mappedBy = "reportingUser",
            fetch = FetchType.LAZY
    )
    private Set<Issue> reportedIssues;

    @OneToMany(mappedBy = "assignedUser",
            fetch = FetchType.LAZY
    )
    private Set<Issue> assignedIssues;
}