import mongoose from "mongoose";
import { securityConfig } from "./security-config.js";

export default class ApiFeatures {
  constructor(model, query, userRole = "guest") {
    this.Model = model;
    this.query = { ...query };
    this.userRole = userRole;
    this.pipeline = [];
    this.countPipeline = [];
    this.addManualFilter = {};
    this.#initialSanitization();
  }

  // ---------- Core Methods ----------
  filter() {
    const queryFilters = this.#parseQueryFilters();
    const mergedFilters = { ...queryFilters, ...this.addManualFilter };
    const safeFilters = this.#applySecurityFilters(mergedFilters);

    if (Object.keys(safeFilters).length > 0) {
      this.pipeline.push({ $match: safeFilters });
      this.countPipeline.push({ $match: safeFilters });
    }
    return this;
  }

  sort() {
    if (this.query.sort) {
      const sortObject = this.query.sort.split(",").reduce((acc, field) => {
        const [key, order] = field.startsWith("-")
          ? [field.slice(1), -1]
          : [field, 1];
        acc[key] = order;
        return acc;
      }, {});
      this.pipeline.push({ $sort: sortObject });
    }
    return this;
  }

  limitFields() {
    if (this.query.fields) {
      const allowedFields = this.query.fields
        .split(",")
        .filter(f => !securityConfig.forbiddenFields.includes(f))
        .reduce((acc, curr) => ({ ...acc, [curr]: 1 }), {});

      this.pipeline.push({ $project: allowedFields });
    }
    return this;
  }

  paginate() {
    const { maxLimit } = securityConfig.accessLevels[this.userRole] || { maxLimit: 100 };
    const page = Math.max(parseInt(this.query.page, 10) || 1, 1);
    const limit = Math.min(
      parseInt(this.query.limit, 10) || 10,
      maxLimit
    );
    
    this.pipeline.push(
      { $skip: (page - 1) * limit },
      { $limit: limit }
    );
    return this;
  }

  populate(input = "") {
    // Determine the fields and projection options based on the input type.
    let fields = [];
    let projection = {};
    
    if (typeof input === "object" && input.path) {
      // If an object is provided, use input.path and input.select.
      fields = input.path.split(",").filter(Boolean);
      if (input.select) {
        input.select.split(" ").forEach(field => {
          if (field) projection[field.trim()] = 1;
        });
      }
    } else if (typeof input === "string") {
      // Fallback to handling comma-separated string.
      fields = input.split(",").filter(Boolean);
    }
    
    // Also include any fields in the query string `populate` parameter.
    const queryFields = this.query.populate?.split(",").filter(Boolean) || [];
    fields = [...new Set([...queryFields, ...fields])];
  
    fields.forEach(field => {
      field = field.trim();
      const { collection, isArray } = this.#getCollectionInfo(field);
  
      // Prepare the lookup stage.
      // If a projection was specified (i.e. from input.select) then use the pipeline lookup syntax.
      let lookupStage = {};
      if (Object.keys(projection).length > 0) {
        // Using pipeline with let & $expr for custom projection.
        lookupStage = {
          $lookup: {
            from: collection,
            let: { localField: `$${field}` },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$localField"] }
                }
              },
              { $project: projection }
            ],
            as: field
          }
        };
      } else {
        // Default lookup without pipeline if no selection is needed.
        lookupStage = {
          $lookup: {
            from: collection,
            localField: field,
            foreignField: "_id",
            as: field
          }
        };
      }
  
      // Push the lookup stage.
      this.pipeline.push(lookupStage);
  
      // Add an unwind stage, with preserved nulls, regardless of isArray.
      // (You can customize this logic further if needed.)
      this.pipeline.push({
        $unwind: {
          path: `$${field}`,
          preserveNullAndEmptyArrays: true
        }
      });
    });
    return this;
  }
  

  addManualFilters(filters) {
    if(filters){
      this.addManualFilter = { ...this.addManualFilter, ...filters };
    }
    return this;
  }

  async execute(options = {}) {
    try {
      const [count, data] = await Promise.all([
        this.Model.aggregate([...this.countPipeline, { $count: "total" }]),
        this.Model.aggregate(this.pipeline)
          .allowDiskUse(options?.allowDiskUse || false)
          .readConcern("majority")
      ]);

      return {
        success: true,
        count: count[0]?.total || 0,
        data
      };
    } catch (error) {
      this.#handleError(error);
    }
  }

  // ---------- Security Methods ----------
  #initialSanitization() {
    // Remove dangerous operators
    ["$where", "$accumulator", "$function"].forEach(op => {
      delete this.query[op];
      delete this.addManualFilter[op];
    });

    // Validate numeric fields
    ["page", "limit"].forEach(field => {
      if (this.query[field] && !/^\d+$/.test(this.query[field])) {
        throw new Error(`Invalid value for ${field}`);
      }
    });
  }

  #parseQueryFilters() {
    const queryObj = { ...this.query };
    ["page", "limit", "sort", "fields", "populate"].forEach(el => delete queryObj[el]);

    return JSON.parse(
      JSON.stringify(queryObj)
        .replace(/\b(gte|gt|lte|lt|in|nin|eq|ne|regex|exists|size)\b/g, "$$$&")
    );
  }
  #applySecurityFilters(filters) {
    let result = { ...filters };
  
    securityConfig.forbiddenFields.forEach(field => delete result[field]);
  
    if (this.userRole !== "admin" && this.Model.schema.path("isActive")) {
      result.isActive = true;
      result = this.#sanitizeNestedObjects(result);
    }
  
    return result;
  }
  

  #sanitizeNestedObjects(obj) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (typeof value === "object" && !Array.isArray(value)) {
        acc[key] = this.#sanitizeNestedObjects(value);
      } else {
        acc[key] = this.#sanitizeValue(key, value);
      }
      return acc;
    }, {});
  }

  #sanitizeValue(key, value) {
    if (key.endsWith("Id") && mongoose.isValidObjectId(value)) {
      return new mongoose.Types.ObjectId(value);
    }
    if (typeof value === "string") {
      if (value === "true") return true;
      if (value === "false") return false;
      if (/^\d+$/.test(value)) return parseInt(value);
    }
    return value;
  }

  #getCollectionInfo(field) {
    const schemaPath = this.Model.schema.path(field);
    if (!schemaPath?.options?.ref) {
      throw new Error(`Invalid populate field: ${field}`);
    }

    const refModel = mongoose.model(schemaPath.options.ref);
    if (refModel.schema.options.restricted && this.userRole !== "admin") {
      throw new Error(`Unauthorized to populate ${field}`);
    }

    return {
      collection: refModel.collection.name,
      isArray: schemaPath.instance === "Array"
    };
  }

  #handleError(error) {
    console.error(`[API Features Error] ${error.message}`);
    throw new Error("Request processing failed due to security constraints");
  }
}