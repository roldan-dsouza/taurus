// server/src/util/validate_request.util.mjs
import mongoose from "mongoose";

// validate if all the fields are there
export const validateRequest = (req, requiredFields = [], source = "body") => {
  const sourceMap = {
    body: req.body,
    query: req.query,
    params: req.params,
  };

  if (!sourceMap[source]) {
    return { valid: false, message: "Invalid validation source" };
  }

  const data = sourceMap[source];

  if (!data || Object.keys(data).length === 0) {
    return {
      valid: false,
      message: `Request ${source} is missing`,
    };
  }

  const missingFields = [];

  for (const field of requiredFields) {
    if (
      !Object.prototype.hasOwnProperty.call(data, field) ||
      data[field] === undefined ||
      data[field] === null ||
      data[field] === ""
    ) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    return {
      valid: false,
      message: `Missing required ${source} fields: ${missingFields.join(", ")}`,
    };
  }

  return { valid: true };
};

// function to validate mongoose object id
export const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { valid: false, message: "Invalid ObjectId format" };
  }
  return { valid: true };
};
