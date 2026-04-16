package org.swe.bugboard.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "History")

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class History {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id",
            nullable = false,
            updatable = false)
    private Issue issue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "main_actor_id",
            nullable = false,
            updatable = false)
    private User mainActor;

    @Column(nullable = false,
            updatable = false
    )
    private String action;

    @Column(nullable = false,
            updatable = false
    )
    private LocalDateTime date;
}
