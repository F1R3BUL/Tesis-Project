#include <Wire.h>
#include <MPU6050.h>
#include <DHT.h>

#define DHTPIN 2          // Digital pin connected to the DHT sensor
#define DHTTYPE DHT11     // DHT 11

DHT dht(DHTPIN, DHTTYPE);
MPU6050 mpu;

void setup() {
  Serial.begin(9600);

  dht.begin();
  // Initialize MPU6050
  mpu.initialize();
  
  // Calibrate MPU6050
  mpu.CalibrateGyro();
  mpu.CalibrateAccel();
  //mpu.setThreshold(3); // Set motion detection threshold for interrupts
}

void loop() {
  // Read accelerometer and gyroscope data
  int16_t ax, ay, az;
  int16_t gx, gy, gz;
  int16_t temp;

  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

  // Convert raw values to g (acceleration) and degrees per second (angular velocity)
  temp = mpu.getTemperature();
  float humidity = dht.readHumidity();    
  float gyroX = gx / 131.0;
  float gyroY = gy / 131.0;
  float gyroZ = gz / 131.0;
  float tempC = (temp / 340.0) + 36.53;

  Serial.print("H:");
  Serial.print(humidity);
  Serial.print(",T:");
  Serial.print(tempC);

  if(gyroX > 2 || gyroY > 2 || gyroZ > 2)
  {
    Serial.print(",S:");
    Serial.print("danger");
  } else {
      Serial.print(",S:");
      Serial.print("ok");
  }

  Serial.println();
  delay(1000); // Delay for 500ms
}