const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const axios = require("axios");

// 1. Configure the Serial Port (Verify your COM port)
const port = new SerialPort({
  path: "COM5",
  baudRate: 19200,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

parser.on("data", (data) => {
  // Clean the incoming string (removes accidental spaces)
  const cleanData = data.trim();
  console.log(`Raw Arduino Data: ${cleanData}`);

  // 2. Split the string by commas
  // Expecting: heartbeat,activity,temperature,methane_level
  const values = cleanData.split(",");

  if (values.length === 4) {
    // 3. Construct the JSON object based on your schema
    const cowPayload = {
      cow_id: "COW101",
      cow_name: "Lakshmi",
      cow_breed: "Gir",
      cow_age: 5,
      device_id: "DEV01",
      heartbeat: parseInt(values[0]),
      activity: parseFloat(values[1]),
      temperature: parseFloat(values[2]),
      methane_level: parseInt(values[3]),
      location: {
        longitude: 74.856, // Static as requested
        latitude: 12.914, // Static as requested
      },
    };

    // 4. POST the data to your local server
    axios
      .post("http://localhost:8000/api/cows/sensor-data", cowPayload)
      .then((res) =>
        console.log("✅ Data sent to Server:", cowPayload.cow_name)
      )
      .catch((err) => console.error("❌ Server Error:", err.message));
  } else {
    console.log("⚠️ Skipping non-data line or partial read:", cleanData);
  }
});

port.on("error", (err) => console.log("Error: ", err.message));
