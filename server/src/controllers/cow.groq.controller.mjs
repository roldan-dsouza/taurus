import { getCowHealthReport } from "../services/groq.services.mjs";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/response.util.mjs";
import { validateRequest } from "../utils/validate_request.util.mjs";

export const getAiAnalysis = async (req, res) => {
  try {
    validateRequest(req, ["cowId"], "param");
    const { cowId } = req.param;
    const groqREsponse = await getCowHealthReport(cowId);

    sendSuccessResponse(res, 200, "Sucessfull", groqREsponse);
  } catch (err) {
    sendErrorResponse(
      res,
      err.status || 500,
      err.message || "internal server error",
    );
  }
};
