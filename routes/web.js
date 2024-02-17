const superAdminAuthRoutes = require('./superadmin/auth');
const superadminAccountRoutes = require('./superadmin/account');
const superadminUserRoleRoutes = require('./superadmin/user_role');
const superadminUserRoutes = require('./superadmin/user');
const superadminStateRoutes = require('./superadmin/state')
const superadminDistrictRoutes  = require('./superadmin/district')
const superadminBlockRoutes = require('./superadmin/block')
const superadminDepartmentsRoutes = require('./superadmin/department')
const superadminGrampanchayatRoutes = require("./superadmin/gram_panchayat");
const superadminSectorRoutes = require('./superadmin/sector')
const superadminSchemeRoutes = require('./superadmin/scheme')
const superadminFinancialYearRoutes = require('./superadmin/financial_year')
const superadminSourceOfFundRoutes = require('./superadmin/source_of_fund')
const superadminSchemeCategoryRoutes = require('./superadmin/scheme_category')
const superadminStateExecutingBodyRoutes = require('./superadmin/state_executing_body')
const superadminSurveyAgencyRoutes = require('./superadmin/survey_agency')
const superadminVillageMaster = require('./superadmin/village_master')
const superadminULBsRoutes = require('./superadmin/ulbs')
const superadminULBTypeRoutes = require('./superadmin/ulb_type')
const superadminMasterStatsRoutes = require('./superadmin/master_master_stats')
const superadminWaterBodyCategoriesRoutes = require('./superadmin/water_body_categories')
const superadminMasterTitleHolderRoutes = require('./superadmin/titleHolder')
const superadminModuleActionRoutes = require('./superadmin/module_action')
const superadminModuleRoutes = require('./superadmin/module')
const superadminModuleRbacRoutes = require('./superadmin/module_rbac')
const superadminWaterBodyRoutes = require("./shared/water_bodies")
const superadminTulipInternRoutes = require('./superadmin/tulip_intern')
const superadminMSGRoutes = require('./superadmin/msg')
const vendorRoutes = require('./shared/vendor')
const authRoutes = require('./shared/auth')
const superadminJOBRoutes = require('./superadmin/job')

const routes = [
    {
        entryPoint: '/api/superadmin/auth',
        routes: superAdminAuthRoutes
    },
    {
        entryPoint: '/api/superadmin/account',
        routes: superadminAccountRoutes
    },
    {
        entryPoint: '/api/superadmin/user-role',
        routes: superadminUserRoleRoutes
    },
    {
        entryPoint: '/api/superadmin/user',
        routes: superadminUserRoutes
    },
    {
        entryPoint: '/api/superadmin/state',
        routes: superadminStateRoutes
    },
    {
      entryPoint: '/api/superadmin/gram-panchayat',
      routes: superadminGrampanchayatRoutes
    },
    {
        entryPoint: '/api/superadmin/district',
        routes: superadminDistrictRoutes
    },
    {
        entryPoint: '/api/superadmin/block',
        routes: superadminBlockRoutes
    },
    {
        entryPoint: '/api/superadmin/department',
        routes: superadminDepartmentsRoutes
    },
    {
        entryPoint: '/api/superadmin/sector',
        routes: superadminSectorRoutes
    },
    {
        entryPoint: '/api/superadmin/financial-year',
        routes: superadminFinancialYearRoutes
    },
    {
        entryPoint: '/api/superadmin/source-of-fund',
        routes: superadminSourceOfFundRoutes
    },
    {
        entryPoint: '/api/superadmin/gram-panchayat',
        routes: superadminGrampanchayatRoutes
    },
    {
        entryPoint: '/api/superadmin/scheme-category',
        routes: superadminSchemeCategoryRoutes
    },
    {
        entryPoint: '/api/superadmin/state-executing-body',
        routes: superadminStateExecutingBodyRoutes
    },
    {
        entryPoint: '/api/superadmin/survey-agency',
        routes: superadminSurveyAgencyRoutes
    },
    {
        entryPoint: '/api/superadmin/village-master',
        routes: superadminVillageMaster
    },
    {
        entryPoint: '/api/superadmin/scheme',
        routes: superadminSchemeRoutes
    },
    {
        entryPoint: '/api/superadmin/ulbs',
        routes: superadminULBsRoutes
    },
    {
        entryPoint: '/api/superadmin/ulb-type',
        routes: superadminULBTypeRoutes
    },
    {
        entryPoint: '/api/superadmin/master-stats',
        routes: superadminMasterStatsRoutes
    },
    {
        entryPoint: '/api/auth',
        routes: authRoutes
    },
    {
        entryPoint: '/api/superadmin/water-body-categories',
        routes: superadminWaterBodyCategoriesRoutes
    },
    {
        entryPoint: '/api/vendor',
        routes: vendorRoutes
    },
    {
        entryPoint: '/api/superadmin/titleHolder',
        routes: superadminMasterTitleHolderRoutes
    },
    {
        entryPoint: '/api/superadmin/module-action',
        routes: superadminModuleActionRoutes
    },
    {
        entryPoint: '/api/superadmin/module',
        routes: superadminModuleRoutes
    },
    {
        entryPoint: '/api/superadmin/module-rbac',
        routes: superadminModuleRbacRoutes
    },
    {
        entryPoint: '/api/water-body',
        routes: superadminWaterBodyRoutes
    },
    {
        entryPoint: '/api/superadmin/tulip-intern',
        routes: superadminTulipInternRoutes
    },
    {
        entryPoint: '/api/superadmin/msg',
        routes: superadminMSGRoutes
    },
    {
        entryPoint: '/api/superadmin/job',
        routes: superadminJOBRoutes
    }
];

module.exports = routes;
