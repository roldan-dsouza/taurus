import { getCowHealthReport } from "../services/groq.services.mjs";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/response.util.mjs";
import { validateRequest } from "../utils/validate_request.util.mjs";
import { getCowDataWithHistory } from "../services/cow.service.mjs";

export const getAiAnalysis = async (req, res) => {
  try {
    const validation = validateRequest(req, ["cow_id"], "params"); // fix: was "param"
    if (!validation.valid) {
      return sendErrorResponse(res, 400, validation.message);
    }

    const { cow_id } = req.params;

    // Fetch latest reading + last 5 for trend context
    const cowData = await getCowDataWithHistory(cow_id);
    if (!cowData) {
      return sendErrorResponse(res, 404, "No data found for this cow");
    }

    const groqResponse = await getCowHealthReport(cowData);
    sendSuccessResponse(res, 200, "Successful", groqResponse);
  } catch (err) {
    sendErrorResponse(
      res,
      err.status || 500,
      err.message || "Internal server error",
    );
  }
};
