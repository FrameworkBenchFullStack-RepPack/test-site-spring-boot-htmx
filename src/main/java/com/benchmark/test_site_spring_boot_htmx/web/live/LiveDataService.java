package com.benchmark.test_site_spring_boot_htmx.web.live;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicInteger;

@Service
public class LiveDataService {

    private static final int[][] LIVE_DATA = {
            { 48, 32, 75 }, { 53, 38, 69 }, { 59, 44, 62 }, { 65, 49, 56 }, { 70, 55, 50 },
            { 75, 61, 44 }, { 80, 66, 38 }, { 85, 71, 33 }, { 88, 75, 27 }, { 91, 78, 22 },
            { 92, 80, 20 }, { 90, 77, 25 }, { 86, 73, 30 }, { 83, 68, 35 }, { 78, 63, 41 },
            { 73, 58, 47 }, { 67, 52, 53 }, { 62, 47, 59 }, { 56, 41, 65 }, { 51, 35, 72 }
    };

    private final SimpMessagingTemplate messagingTemplate;
    private final AtomicInteger currentIndex = new AtomicInteger(0);

    public LiveDataService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Scheduled(fixedRate = 1000)
    public void broadcast() {
        int index = currentIndex.getAndUpdate(i -> (i + 1) % LIVE_DATA.length);
        int[] numbers = LIVE_DATA[index];
        messagingTemplate.convertAndSend("/topic/live-data", new LiveNumbers(numbers[0], numbers[1], numbers[2]));
    }

    public record LiveNumbers(int number1, int number2, int number3) {
    }
}
