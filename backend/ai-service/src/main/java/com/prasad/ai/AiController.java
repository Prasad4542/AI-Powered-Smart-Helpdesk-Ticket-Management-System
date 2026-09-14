package com.prasad.ai;
import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/ai") @CrossOrigin(origins="*")
public class AiController {
 @PostMapping("/analyze") public Map<String,Object> analyze(@RequestBody Map<String,String> body){
  String text=(body.getOrDefault("title","")+" "+body.getOrDefault("description","")).toLowerCase();
  String category="General",priority="MEDIUM"; String suggestion="Check the issue details and assign it to the appropriate support agent.";
  if(text.matches(".*(password|login|account|authentication).*")){category="Access & Security";suggestion="Verify account status, reset credentials if required, and check authentication logs.";}
  else if(text.matches(".*(payment|refund|invoice|billing|charge).*")){category="Billing";suggestion="Verify the transaction, invoice and payment gateway logs before processing a correction.";}
  else if(text.matches(".*(server|api|database|error|down|500|bug).*")){category="Technical";suggestion="Check application logs, API health and recent deployments; reproduce the error if possible.";}
  else if(text.matches(".*(laptop|computer|printer|network|wifi).*")){category="Hardware & Network";suggestion="Check device/network connectivity and basic hardware diagnostics.";}
  if(text.matches(".*(urgent|critical|down|security|production|blocked).*"))priority="HIGH";
  return Map.of("category",category,"priority",priority,"suggestion",suggestion,"confidence",0.91);
 }
}