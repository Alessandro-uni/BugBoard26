package org.swe.bugboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.swe.bugboard.dto.AuthenticationRequest;
import org.swe.bugboard.dto.AuthenticationResponse;
import org.swe.bugboard.security.CustomUserDetails;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final AuthenticationManager authenticationManager;
    private final JwtEncoder jwtEncoder;

    @Value("${application.security.jwt.expiration-time}")
    private Long jwtExpiration;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getMail(),
                            request.getRawPassword()
                    )
            );

            Instant now = Instant.now();
            Instant expirationTime = now.plusMillis(jwtExpiration);

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            String mail = userDetails.getUsername();
            Long id = userDetails.getId();
            String role = userDetails.getRole().name();

            JwtClaimsSet claims = JwtClaimsSet.builder()
                    .issuer("bugboard")
                    .issuedAt(now)
                    .expiresAt(expirationTime)
                    .subject(mail)
                    .claim("userId", id)
                    .claim("role", role).build();

            JwtEncoderParameters parameters = JwtEncoderParameters.from(
                    JwsHeader.with(MacAlgorithm.HS256).build(),
                    claims
            );

            String jwtToken = jwtEncoder.encode(parameters).getTokenValue();

            return new AuthenticationResponse(jwtToken, "Login avvenuto con successo");
        } catch (AuthenticationException e) {
            return new AuthenticationResponse(null, "Mail o Password errati");
        }

    }
}
