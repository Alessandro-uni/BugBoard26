package org.swe.bugboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequest {

    private long id;
    private String mail;
    private CharSequence rawPassword;
    private String username;
    private String role;
}
