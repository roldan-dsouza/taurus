import { getCowHealthReport } from "../services/groq.services.mjs";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/response.util.mjs";
import { validateRequest } from "../utils/validate_request.util.mjs";

export const getAiAnalysis = async (req, res) => {
  try {
    validateRequest(req, ["cow_id"], "param");
    const { cow_id } = req.params;
    const groqREsponse = await getCowHealthReport(cow_id);

    sendSuccessResponse(res, 200, "Sucessfull", groqREsponse);
  } catch (err) {
    sendErrorResponse(
      res,
      err.status || 500,
      err.message || "internal server error",
    );
  }
};
