package org.swe.bugboard.Service;

import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.swe.bugboard.dto.SignUpUserRequest;
import org.swe.bugboard.dto.UserRequest;
import org.swe.bugboard.dto.UserResponse;
import org.swe.bugboard.model.IssueStatus;
import org.swe.bugboard.model.User;
import org.swe.bugboard.model.UserRole;
import org.swe.bugboard.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;

    public UserResponse createUser(SignUpUserRequest user) {
        // todo: hashing della password inserita
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        User newUser = User.builder().id(user.getId())
                .mail(user.getMail())
                .username(user.getUsername())
                .hashedPassword(passwordEncoder.encode(user.getRawPassword()))
                .role(UserRole.valueOf(user.getRole())).build();

        User savedUser = userRepository.save(newUser);

        return convertModelToResponse(savedUser);
    }

    public List<UserRequest> getAllUser() {
        List<User> users = userRepository.findAll();

        return users.stream().map(this::convertModelToRequest).toList();
    }

    public UserRequest getUserById(Long id) {
        Optional<User> user = userRepository.findById(id);

        return user.map(this::convertModelToRequest).
                orElseThrow(() -> new RuntimeException("Nessun utente trovato con id: " + id));
    }

    public UserRequest getUserByMail(String mail) {
        Optional<User> user = userRepository.findByMail(mail);

        return user.map(this::convertModelToRequest).
                orElseThrow(() -> new RuntimeException("Nessun utente trovato con mail: " + mail));
    }

    public List<UserRequest> getUserByAvailabilityAsc() {
        List<IssueStatus> activatedStatus = List.of(IssueStatus.TODO, IssueStatus.INPROGRESS);
        List<User> users = userRepository.findByActivedStatusAsc(activatedStatus);

        return users.stream().map(this::convertModelToRequest).toList();
    }

    private UserResponse convertModelToResponse(User user) {

        return new UserResponse(user.getId(), user.getMail(), user.getUsername(), user.getRole().name());
    }

    private UserRequest convertModelToRequest(User user) {
        return UserRequest.builder().id(user.getId())
                .mail(user.getMail())
                .username(user.getUsername())
                .role(user.getRole().toString()).build();
    }

}
