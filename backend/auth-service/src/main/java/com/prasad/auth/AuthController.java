package com.prasad.auth;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/auth") @CrossOrigin(origins="*")
public class AuthController {
 private final UserRepository repo; private final PasswordEncoder encoder; private final JwtService jwt;
 public AuthController(UserRepository r,PasswordEncoder e,JwtService j){repo=r;encoder=e;jwt=j;}
 @PostMapping("/register") public ResponseEntity<?> register(@RequestBody Map<String,String> b){
  String email=b.get("email"); if(email==null||b.get("password")==null||b.get("name")==null)return ResponseEntity.badRequest().body(Map.of("message","Name, email and password are required"));
  if(repo.findByEmail(email).isPresent())return ResponseEntity.status(409).body(Map.of("message","Email already registered"));
  User u=new User(b.get("name"),email,encoder.encode(b.get("password")));repo.save(u);return ResponseEntity.ok(Map.of("message","Registration successful"));
 }
 @PostMapping("/login") public ResponseEntity<?> login(@RequestBody Map<String,String> b){
  Optional<User> o=repo.findByEmail(b.get("email")); if(o.isEmpty()||!encoder.matches(b.get("password"),o.get().getPassword()))return ResponseEntity.status(401).body(Map.of("message","Invalid email or password"));
  User u=o.get();return ResponseEntity.ok(Map.of("token",jwt.generate(u.getEmail()),"name",u.getName(),"email",u.getEmail()));
 }
}