package com.ns.chatapp.controller;

import com.ns.chatapp.config.JwtUtil;
import com.ns.chatapp.dto.ApiResponse;
import com.ns.chatapp.model.User;
import com.ns.chatapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if(userService.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Username is already taken.", null));
        }
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        userService.save(user);
        return ResponseEntity.ok(new ApiResponse<>(true, "User registered successfully.", null));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        Optional<User> userOptional = userService.findByUsername(user.getUsername());

        if (userOptional.isPresent()) {
            User foundUser = userOptional.get();
            boolean passwordMatches = passwordEncoder.matches(user.getPassword(), foundUser.getPassword());

            if (passwordMatches) {
                String token = jwtUtil.generateToken(foundUser.getUsername());
                return ResponseEntity.ok(new ApiResponse<>(true, "Login successful.", token));
            }
        }

        return ResponseEntity.status(401).body(new ApiResponse<>(false, "Invalid username or password.", null));
    }
}
