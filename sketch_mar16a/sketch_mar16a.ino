#include <Wire.h>
#include <WiFi.h>

// --- WIFI CREDENTIALS ---
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";

WiFiServer server(80);

// --- PIN DEFINITIONS (ESP32) ---
// Note: Use ADC1 pins (32-39) as ADC2 pins fail when WiFi is active.
const int pulsePin = 32; // Connect Pulse Signal to GPIO 32
const int tempPin  = 34; // Connect LM35 Signal to GPIO 34
const int gasPin   = 35; // Connect Gas Signal to GPIO 35
const int BeepPin  = 25; // Connect Buzzer (+) to GPIO 25
#define ADXL345_ADDR 0x53

// --- PULSE VARIABLES ---
int threshold = 2200;       // Adjusted for ESP32 12-bit ADC (0-4095)
unsigned long lastBeatTime = 0;
int bpmReadings[10];
int readIndex = 0;
long totalBPM = 0;
int avgBPM = 0;
bool beatDetected = false;
const unsigned long beatLockout = 250;

// --- MOTION & POINTS VARIABLES ---
int16_t prevX = 0, prevY = 0, prevZ = 0;
long cowPoints = 0; 
float cowIntensity = 0;

// --- OTHER SENSOR VARIABLES ---
float tempC = 0;
int gasLevel = 0;

void setup() {
  Serial.begin(115200); 
  
  // ESP32 I2C Initialization (SDA = 21, SCL = 22)
  Wire.begin(21, 22);
  
  pinMode(BeepPin, OUTPUT);

  // Initialize ADXL345 Accelerometer
  Wire.beginTransmission(ADXL345_ADDR);
  Wire.write(0x2D); // Power Control Register
  Wire.write(8);    // Measure Mode
  Wire.endTransmission();

  // Connect to WiFi
  Serial.print("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  server.begin();
  Serial.println("=== CowFit: ESP32 System Live ===");
}

void loop() {
  unsigned long currentTime = millis();

  readPulse(currentTime);
  readIntensityAndPoints(); 
  readTemperature();
  readGasSensor();

  // Web Server Handling
  WiFiClient client = server.available();
  if (client) {
    String currentLine = "";
    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        if (c == '\n') {
          if (currentLine.length() == 0) {
            // Send Standard HTTP Response Header
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println("Connection: close");
            client.println();
            
            // Basic Dashboard HTML
            client.print("<html><head><title>CowFit Monitor</title>");
            client.print("<meta http-equiv='refresh' content='2'></head>"); // Auto-refresh every 2s
            client.print("<body style='font-family:sans-serif; text-align:center;'>");
            client.print("<h1>CowFit Live Vitals</h1>");
            client.print("<hr><p style='font-size:24px;'>Heart Rate: <b>" + String(avgBPM) + " BPM</b></p>");
            client.print("<p style='font-size:24px;'>Activity Points: <b>" + String(cowPoints) + "</b></p>");
            client.print("<p style='font-size:24px;'>Temperature: <b>" + String(tempC) + " C</b></p>");
            client.print("<p style='font-size:24px;'>Gas Level: <b>" + String(gasLevel) + "</b></p>");
            client.print("</body></html>");
            break;
          } else { currentLine = ""; }
        } else if (c != '\r') { currentLine += c; }
      }
    }
    client.stop();
  }

  // Debugging output to Serial Monitor
  static unsigned long lastPrint = 0;
  if (currentTime - lastPrint > 1000) {
    displayMasterData();
    lastPrint = currentTime;
  }
}

// --- MODULES ---

void readIntensityAndPoints() {
  Wire.beginTransmission(ADXL345_ADDR);
  Wire.write(0x32);
  Wire.endTransmission(false);
  Wire.requestFrom(ADXL345_ADDR, 6);

  if (Wire.available() == 6) {
    int16_t x = Wire.read() | (Wire.read() << 8);
    int16_t y = Wire.read() | (Wire.read() << 8);
    int16_t z = Wire.read() | (Wire.read() << 8);

    // Calculate movement delta
    int deltaX = abs(x - prevX);
    int deltaY = abs(y - prevY);
    int deltaZ = abs(z - prevZ);

    cowIntensity = (deltaX + deltaY + deltaZ);

    // Filter noise and update points
    if (cowIntensity > 40) { // Threshold adjusted for ESP32 noise
      cowPoints += (cowIntensity / 20);
    }

    prevX = x; prevY = y; prevZ = z;
  }
}

void BeepAction() {
  for(int i = 0; i < 3; i++) {
    digitalWrite(BeepPin, HIGH);
    delay(100);
    digitalWrite(BeepPin, LOW); 
    delay(100);
  }
}

void readPulse(unsigned long currentTime) {
  int signal = analogRead(pulsePin);
  
  if (signal > threshold && !beatDetected) {
    if ((currentTime - lastBeatTime) > beatLockout) {
      beatDetected = true;
      unsigned long interval = currentTime - lastBeatTime;
      lastBeatTime = currentTime;

      if (interval > 300 && interval < 2000) {
        int bpm = 60000 / interval;
        totalBPM -= bpmReadings[readIndex];
        bpmReadings[readIndex] = bpm;
        totalBPM += bpm;
        readIndex = (readIndex + 1) % 10;
        avgBPM = totalBPM / 10; // Fixed: dividing by 10 for correct average
      }
    }
  }
  if (signal < threshold) beatDetected = false;
}

void readTemperature() {
  int rawTemp = analogRead(tempPin);
  // ESP32: 3.3V / 4095 steps. LM35: 10mV per degree C.
  float voltage = rawTemp * (3.3 / 4095.0);
  tempC = voltage * 100.0;
}

void readGasSensor() {
  gasLevel = analogRead(gasPin);
  if(gasLevel > 1800) { // Adjusted for 12-bit ADC range
    BeepAction();
  }
}

void displayMasterData() {
  // Prints CSV format to Serial Monitor
  Serial.print("BPM:"); Serial.print(avgBPM);
  Serial.print(" | Pts:"); Serial.print(cowPoints);
  Serial.print(" | Temp:"); Serial.print(tempC);
  Serial.print(" | Gas:"); Serial.println(gasLevel);
}