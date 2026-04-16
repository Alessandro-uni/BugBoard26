package org.swe.bugboard.dto;

import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String mail;
    private String username;
    private String role;
}
