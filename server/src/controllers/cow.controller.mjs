import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/response.util.mjs";
import {
  addSensorDataService,
  getLatestCowDataService,
} from "../services/cow.service.mjs";
import { validateRequest } from "../utils/validate_request.util.mjs";

export const addSensorData = async (req, res) => {
  try {
    const validation = validateRequest(req, [
      "cowId",
      "cow_name",
      "cow_breed",
      "cow_age",
      "device_id",
      "temperature",
      "heartbeat",
      "activity",
      "methane_level",
    ]);
    if (!validation.valid) {
      return sendErrorResponse(res, 400, validation.message);
    }

    const {
      cowId,
      cow_name,
      cow_breed,
      cow_age,
      device_id,
      temperature,
      heartbeat,
      activity,
      methane_level,
    } = req.body;

    const sensorData = await addSensorDataService(
      cowId,
      cow_name,
      cow_breed,
      cow_age,
      device_id,
      temperature,
      heartbeat,
      activity,
      methane_level,
    );
    if (!sensorData) {
      return sendErrorResponse(res, 404, "Cow not found");
    }

    sendSuccessResponse(res, 200, "Sensor data added successfully", sensorData);
  } catch (err) {
    console.error("Error adding sensor data:", err);

    sendErrorResponse(
      res,
      500,
      "An error occurred while adding sensor data",
      err.message,
    );
  }
};

export const getLatestCowData = async (req, res) => {
  try {
    const validation = validateRequest(req, ["cowId"], "params");
    if (!validation.valid) {
      return sendErrorResponse(res, 400, validation.message);
    }

    const { cowId } = req.params;

    const latestData = await getLatestCowDataService(cowId);
    if (!latestData) {
      return sendErrorResponse(res, 404, "No sensor data found for this cow");
    }

    sendSuccessResponse(res, 200, "Latest cow data retrieved", latestData);
  } catch (err) {
    console.error("Error retrieving latest cow data:", err);

    sendErrorResponse(
      res,
      500,
      "An error occurred while retrieving latest cow data",
      err.message,
    );
  }
};
