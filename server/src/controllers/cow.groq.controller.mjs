import { getCowHealthReport } from "../services/groq.services.mjs";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/response.util.mjs";
import { validateRequest } from "../utils/validate_request.util.mjs";
import { getLatestCowDataService } from "../services/cow.service.mjs";

export const getAiAnalysis = async (req, res) => {
  try {
    validateRequest(req, ["cow_id"], "param");
    const { cow_id } = req.params;
    const cowData = await getLatestCowDataService(cow_id);
    if (!cowData) {
      return sendErrorResponse(res, 404, "No data found for this cow");
    }
    const groqResponse = await getCowHealthReport(cowData);

    sendSuccessResponse(res, 200, "Successful", groqResponse);
  } catch (err) {
    sendErrorResponse(
      res,
      err.status || 500,
      err.message || "internal server error",
    );
  }
};
