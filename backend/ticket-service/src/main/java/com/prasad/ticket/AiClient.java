package com.prasad.ticket;
import org.springframework.cloud.openfeign.FeignClient; import org.springframework.web.bind.annotation.*; import java.util.Map;
@FeignClient(name="ai-service") public interface AiClient{@PostMapping("/api/ai/analyze") Map<String,Object> analyze(@RequestBody Map<String,String> body);}