const personaldetail = require("../../../models/personaldetail");
const spousedetails = require("../../../models/spousedetails");
const attendantdetails = require("../../../models/attendantdetails");
const moment = require('moment');
const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");

const listPersnlDetails = async (req, res) => {
    try {
        let requestData = req.body;
        let limit = parseInt(requestData.limit);
        let skip = (requestData.page - 1) * requestData.limit;
        let filterData = {};

        if(requestData.SchemeID) filterData.Scheme_Id = parseInt(requestData.Scheme_Id);
        if(requestData.TripGroupID) filterData.TripGroupID = parseInt(requestData.TripGroupID);
        if(requestData.ApplicationID) filterData.id = parseInt(requestData.ApplicationID);
        if(requestData.Domicile_DistId) filterData.Domicile_DistId = parseInt(requestData.Domicile_DistId);
        if(requestData.Applicant_Name) filterData.Applicant_Name = requestData.Applicant_Name;
        if(requestData.RegistrationNo) filterData.RegistrationNo = requestData.RegistrationNo;
        filterData.IsDeletd = 0;
        const listPersnl = await personaldetail.getPersonalDetails(filterData, limit, skip);
        res.status(200).json({ 
            Status:'true', 
            Count: listPersnl.length,
            Data: listPersnl, 
            Message: 'Personal Details Listing' 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            Status: "False",
            Message: "Error",
            Error: error.toString()
        });
    }
}

const listSposeDetails = async (req, res) => {
    try {
        let requestData = req.body;
        let limit = parseInt(requestData.limit);
        let skip = (requestData.page - 1) * requestData.limit;
        const listSpouse = await spousedetails.getSpouseDetails(limit, skip);
        res.status(200).json({ 
            Status:'true', 
            Count: listSpouse.length,
            Data: listSpouse, 
            Message: 'Spose Details Listing' 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            Status: "False",
            Message: "Error",
            Error: error.toString()
        });
    }
}

const listAttendantDetails = async (req, res) => {
    try {
        let requestData = req.body;
        let limit = parseInt(requestData.limit);
        let skip = (requestData.page - 1) * requestData.limit;
        const listAttendant = await attendantdetails.getAttendantDetails(limit, skip);
        res.status(200).json({ 
            Status:'true', 
            Count: listAttendant.length,
            Data: listAttendant, 
            Message: 'Attendant Details Listing' 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            Status: "False",
            Message: "Error",
            Error: error.toString()
        });
    }
}

const listDetailsTirthaYatra = async (req, res) => {
    let requestData = req.body;
    let filterData = {};
    if (requestData.Domicile_DistId) filterData.Domicile_DistId = parseInt(requestData.Domicile_DistId) ;
    if (requestData.RegistrationNo) filterData.RegistrationNo = requestData.RegistrationNo ;
    console.log(filterData);
    let limit = parseInt(requestData.limit);
    let skip = (requestData.page - 1) * requestData.limit;
    const listPersnl = await personaldetail.getPersonalDetailsWithoutFilterData(filterData, limit, skip);
    console.log(listPersnl);
    res.status(200).json({ 
        Status:'true', 
        Count: listPersnl.length,
        Data: listPersnl, 
        Message: 'Personal Details Listing' 
    });
}

module.exports = {
	listPersnlDetails,
    listSposeDetails,
    listAttendantDetails,
    listDetailsTirthaYatra
};