package org.swe.bugboard.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.swe.bugboard.dto.user.AuthenticationRequest;
import org.swe.bugboard.dto.user.AuthenticationResponse;
import org.swe.bugboard.security.CustomUserDetails;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final AuthenticationManager authenticationManager;
    private final JwtEncoder jwtEncoder;

    @Value("${application.security.jwt.expiration-time}")
    private Long jwtExpiration;

    @Value("${application.security.jwt.jws-algorithm}")
    private String jcaAlgorithm;

    @Transactional
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getMail().toLowerCase(),
                        request.getRawPassword()
                )
        );

        Instant now = Instant.now();
        Instant expirationTime = now.plusMillis(jwtExpiration);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        assert userDetails != null;
        String mail = userDetails.getUsername();
        Long id = userDetails.getId();
        String username = userDetails.getName();
        String role = userDetails.getRole().name();
        List<String> permissions = userDetails.getRole().getPermissions()
                .stream()
                .map(Enum::name)
                .toList();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("bugboard")
                .issuedAt(now)
                .expiresAt(expirationTime)
                .subject(mail)
                .claim("userId", id)
                .claim("username", username)
                .claim("role", role)
                .claim("permissions", permissions)
                .build();


        JwtEncoderParameters parameters = JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.from(jcaAlgorithm)).build(),
                claims
        );

        String jwtToken = jwtEncoder.encode(parameters).getTokenValue();

        return new AuthenticationResponse(jwtToken);
    }
}
