package org.swe.bugboard.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.view.AbstractCachingViewResolver;
import org.swe.bugboard.dto.UserDto;
import org.swe.bugboard.model.IssueStatus;
import org.swe.bugboard.model.User;
import org.swe.bugboard.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;
    private final AbstractCachingViewResolver abstractCachingViewResolver;

    public List<UserDto> getAllUser() {
        List<User> users = userRepository.findAll();

        return users.stream().map(this::convertToDto).toList();
    }

    public UserDto getUserByMail(String mail) {
        Optional<User> user = userRepository.findByMail(mail);

        return user.map(this::convertToDto).
                orElseThrow(() -> new RuntimeException("Nessun utente trovato con mail: " + mail));
    }

    public List<UserDto> getUserByAvailabilityAsc() {
        List<IssueStatus> activatedStatus = List.of(IssueStatus.TODO, IssueStatus.INPROGRESS);
        List<User> users = userRepository.findByAvailabilityAsc(activatedStatus);

        return users.stream().map(this::convertToDto).toList();
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setMail(user.getMail());
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole().name());

        return dto;
    }
}
