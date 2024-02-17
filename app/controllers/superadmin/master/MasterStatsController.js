const State = require("../../../models/State");
const District = require("../../../models/District");
const Block = require("../../../models/Block");
const FinancialYear = require("../../../models/FinancialYear");
const SourceOfFund = require("../../../models/SourceOfFund");
const SurveyAgency = require("../../../models/SurveyAgency");
const Department = require("../../../models/Department");
const SchemeCategory = require("../../../models/SchemeCategory");
const Scheme = require("../../../models/Scheme");
const UrbanLocalBody = require("../../../models/UrbanLocalBody");
const UrbanLocalBodyType = require("../../../models/UrbanLocalBodyType");
const Vendor = require("../../../models/Vendor")
const Module = require('../../../models/Module')

const logger = require("../../../../util/logger");

const masterStats = async (req, res) => {

    try {
        const [
            statesCount,
            districtsCount,
            blocksCount,
            financialYearsCount,
            sourceOfFundsCount,
            surveyAgenciesCount,
            departmentsCount,
            schemeCategoriesCount,
            schemesCount,
            urbanLocalBodiesCount,
            urbanLocalBodyTypesCount,
            moduleCount,
            vendorCount
        ] = await Promise.all([
            State.countAllStates(),
            District.countAllDistricts(),
            Block.countAllBlocks(),
            FinancialYear.countAllFinancialYears(),
            SourceOfFund.countAllSourceOfFunds(),
            SurveyAgency.countAllSurveyAgencies(),
            Department.countAllDepartments(),
            SchemeCategory.countAllSchemeCategories(),
            Scheme.countAllSchemes(),
            UrbanLocalBody.countAllUrbanLocalBodies(),
            UrbanLocalBodyType.countAllTypes(),
            Module.countAllModules(),
            Vendor.countAllVendor()
        ]);

        return res.json({
            blocks_count: blocksCount,
            departments_count: departmentsCount,
            districts_count: districtsCount,
            financial_years_count: financialYearsCount,
            schemes_count: schemesCount,
            scheme_categories_count: schemeCategoriesCount,
            source_of_funds_count: sourceOfFundsCount,
            states_count: statesCount,
            survey_agencies_count: surveyAgenciesCount,
            urban_local_bodies_count: urbanLocalBodiesCount,
            urban_local_body_types_count: urbanLocalBodyTypesCount,
            modules_count: moduleCount,
            Vendor_count: vendorCount
        });
    } catch (error) {
        logger.log(error);
        return res.status(500).json({
            message: 'Unable to fetch the dashboard stats.'
        });
    }
}

module.exports = {
    masterStats: masterStats
}