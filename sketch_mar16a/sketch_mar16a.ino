#include <Wire.h>

// --- PIN DEFINITIONS ---
const int pulsePin = A0;
const int tempPin = A1;
const int gasPin = A3;
const int BeepPin = 8;
#define ADXL345_ADDR 0x53

// --- PULSE VARIABLES ---
int signal;
int threshold = 550;
unsigned long lastBeatTime = 0;
unsigned long currentTime = 0;
int bpmReadings[10];
int readIndex = 0;
int totalBPM = 0;
int avgBPM = 0;
bool beatDetected = false;
unsigned long beatLockout = 250;

// --- MOTION & POINTS VARIABLES ---
int16_t prevX, prevY, prevZ;
long cowPoints = 0; 
float cowIntensity = 0;

// --- OTHER SENSOR VARIABLES ---
float tempC = 0;
int gasLevel = 0;

void setup() {
  Serial.begin(19200); 
  Wire.begin();
  pinMode(BeepPin, OUTPUT);

  Wire.beginTransmission(ADXL345_ADDR);
  Wire.write(0x2D); 
  Wire.write(8);    
  Wire.endTransmission();

  Serial.println("=== CowFit: Points System Initialized ===");
}

void loop() {
  currentTime = millis();

  readPulse();
  readIntensityAndPoints(); 
  readTemperature();
  readGasSensor();

  static unsigned long lastPrint = 0;
  if (currentTime - lastPrint > 1000) {
    displayMasterData();
    lastPrint = currentTime;
  }

  delay(10);
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

    // 1. Calculate how much the sensor moved since the LAST reading
    // This removes the "Gravity" constant (4.0) automatically!
    int deltaX = abs(x - prevX);
    int deltaY = abs(y - prevY);
    int deltaZ = abs(z - prevZ);

    cowIntensity = (deltaX + deltaY + deltaZ);

    // 2. Add points only if intensity is above a small noise threshold (e.g., 20)
    if (cowIntensity > 20) {
      cowPoints += (cowIntensity / 10);
    }

    // 3. Store current values for the next comparison
    prevX = x;
    prevY = y;
    prevZ = z;
  }
}

void Beep() {
  int times = 5;
  int count = 0;
  while(count < times) {
    digitalWrite(BeepPin, HIGH);
    delay(200);
    digitalWrite(BeepPin, LOW); 
    delay(200);
    count++; 
  }
}

void readPulse() {
  signal = analogRead(pulsePin);
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
        avgBPM = totalBPM / 20; 
      }
    }
  }
  if (signal < threshold) beatDetected = false;
}

void readTemperature() {
  int rawTemp = analogRead(tempPin);
  float voltage = rawTemp * (5.0 / 1024.0);
  tempC = voltage * 100.0;
}

void readGasSensor() {
  gasLevel = analogRead(gasPin);
  if(gasLevel > 300) { // Increased threshold to avoid false beeps
    Beep();
  }
}

void displayMasterData() {
 Serial.print(avgBPM);
  Serial.print(","); Serial.print(cowPoints);
  Serial.print(","); Serial.print(tempC);
  Serial.print(","); Serial.println(gasLevel);
  Serial.println();
}