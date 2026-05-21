package org.swe.bugboard.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "IssueImage")

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IssueImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true,
            nullable = false
    )
    private String name;

    @Lob
    private byte[] rawImage;

}
