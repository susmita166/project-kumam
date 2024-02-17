const WaterBodies = require("../../../models/WaterBodies");
const WaterBodyLogs = require("../../../models/WaterBodyLogs");
const Scheme = require("../../../models/Scheme");
const District = require("../../../models/District");
const UrbanLocalBody = require("../../../models/UrbanLocalBody");
const WaterBodyCategories = require("../../../models/WaterBodyCategories");
const WaterBodyDprs = require("../../../models/WaterBodyDprs");
const WaterBodyDprsLogs = require("../../../models/WaterBodyDprsLog");
const WaterBodyParameters = require("../../../models/WaterBodyParameters");
const WaterBodyParametersLogs = require("../../../models/WaterBodyParametersLog");
const titleHolder = require("../../../models/titleHolder");
const { Op } = require("sequelize");

const addWaterBodies = async (req, res) => {
  const waterBodies = req.body;
  const userDetail = req.user_detail;

  const existingDistrict = await District.findOne({
    where: {
      id: waterBodies.district_id,
      status: {
        [Op.ne]: District.STATUS_DELETED,
      },
    },
  });
  if (!existingDistrict) {
    return res.status(404).json({ message: "District not found" });
  }

  const existingScheme = await Scheme.findOne({
    where: {
      id: waterBodies.scheme_id,
      status: { [Op.ne]: Scheme.STATUS_DELETED },
    },
  });
  if (!existingScheme) {
    return res.status(404).json({ message: "Scheme not found" });
  }

  const existingULB = await UrbanLocalBody.findOne({
    where: {
      id: waterBodies.ulb_id,
      status: { [Op.ne]: UrbanLocalBody.STATUS_DELETED },
    },
  });
  if (!existingULB) {
    return res.status(404).json({ message: "Urban Local Body not found" });
  }

  const existingCategory = await WaterBodyCategories.findOne({
    where: {
      id: waterBodies.category_id,
      status: { [Op.ne]: WaterBodyCategories.STATUS_DELETED },
    },
  });
  if (!existingCategory) {
    return res.status(404).json({ message: "Water Body Category not found" });
  }

  const existingtingHolder = await titleHolder.findOne({
    where: {
      id: waterBodies.title_holder_id,
      status: { [Op.ne]: titleHolder.STATUS_DELETED },
    },
  });
  if (!existingtingHolder) {
    return res.status(404).json({ message: "Title Holder not found" });
  }

  if (userDetail && userDetail.department_id === 4) {
    const isCreated = await WaterBodies.createWaterBodies( waterBodies, req.user_detail );

    if (isCreated) {
      const idInsertToMsgLog = await WaterBodyLogs.createWaterBodies( isCreated, waterBodies, req.user_detail);

      if (idInsertToMsgLog) {
        if (waterBodies.previously_rejuvenated === "y") {

          const dprsCreated = await WaterBodyDprs.createWaterBodyDprs( waterBodies,req.user_detail );
          const parametersCreated = await WaterBodyParameters.createWaterBodyParameters( waterBodies,req.user_detail );

          if (dprsCreated && parametersCreated) {

            await WaterBodyDprsLogs.createDprsLogs( dprsCreated, waterBodies, req.user_detail );
            await WaterBodyParametersLogs.createParametersLogs( parametersCreated, waterBodies, req.user_detail );

            return res.json({ message: "Water bodies dprs & parameters created successfully." });
          } else {
             return res.status(500).json({ message: "Failed to create Dprs or Parameters." });
          }
        }
        return res.json({ message: "water bodies created successfully." });
      }
      return res.status(404).json({ message: "Unable to create water bodies." });
    } else {
      return res.status(500).json({ message: "Unable to create water bodies." });
    }
  } else {
    return res.status(401).json({ message: "Only ULB users are allowed to add water bodies." });
  }
};

const waterBodiesList = async (req, res) => {
  const data = await WaterBodies.fetchWaterBodies();
  return res.json({ count: data.length, data: data });
};

const waterBodiesDetail = async (req, res) => {
  try {
    const data = await WaterBodies.WaterBodyDetail(req.query.id);
    if (!data) {
      return res.status(404).json({ message: "Water body not found" });
    }
    return res.json(data);
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Unable to fetch water body details.",
    });
  }
};

const editWaterBodies = async (req, res) => {
  const waterBodyId = req.body.id;
  const waterBodyData = req.body;
  try {
    const isExists = await WaterBodies.WaterBodyDetail(waterBodyId);
    if (!isExists) {
      return res.status(404).json({ message: "Water body does not exist" });
    }

    if (isExists.previously_rejuvenated === "y") {
      let dprs = await WaterBodyDprs.findOne({
        where: { water_body_id: waterBodyId },
      });
      let parameters = await WaterBodyParameters.findOne({
        where: { water_body_id: waterBodyId },
      });

      if (dprs && parameters) {
        await WaterBodyDprs.updateWaterBodyDprs(
          dprs,
          waterBodyData,
          req.user_detail
        );
        await WaterBodyParameters.updateWaterBodyParameters(
          parameters,
          waterBodyData,
          req.user_detail
        );
      } else {
        await WaterBodyDprs.createWaterBodyDprs(waterBodyData, req.user_detail);
        await WaterBodyParameters.createWaterBodyParameters(
          waterBodyData,
          req.user_detail
        );
      }
    } else {
      await WaterBodyDprs.deleteWaterBodyDprs(waterBodyId, req.user_detail);
      await WaterBodyParameters.deleteWaterBodyParameters(
        waterBodyId,
        req.user_detail
      );
    }

    const isUpdated = await WaterBodies.updateWaterBody(
      waterBodyData,
      req.user_detail
    );
    if (isUpdated && isUpdated !== false) {
      const updateDataIntoLog = await WaterBodyLogs.upadteLog(
        waterBodyData,
        req.user_detail
      );
      if (updateDataIntoLog) {
        // return res.json({message:"Updated water body"})
        const dprsLogCreated = await WaterBodyDprsLogs.createDprsLogs(
          waterBodyData,
          req.user_detail
        );
        const parametersLogCreated =
          await WaterBodyParametersLogs.createParametersLogs(
            waterBodyData,
            req.user_detail
          );

        if (dprsLogCreated && parametersLogCreated) {
          return res.json({ message: "Water body updated!" });
        } else {
          return res
            .status(500)
            .json({ message: "Failed to create Dprs or Parameters log." });
        }
      }
    }
    return res.status(404).json({ message: "Water body not updated" });
  } catch (error) {
    console.error("Error updating water body:", error);
    return res.status(500).json({ message: "Failed to update water body" });
  }
};

const deleteWaterBodies = async (req, res) => {
  const isExists = await WaterBodies.WaterBodyDetail(req.body.id);
  if (!isExists) {
    return res.status(404).json({ message: "Water body does not exist" });
  }
  const isDeleted = await WaterBodies.deleteWaterBody(
    req.body,
    req.user_detail
  );
  if (!isDeleted) {
    return res.status(500).json({ message: "Unable to delete water body." });
  }
  return res.json({ message: "Water body has been deleted." });
};

module.exports = {
  addWaterBodies,
  waterBodiesList,
  waterBodiesDetail,
  editWaterBodies,
  deleteWaterBodies,
};
