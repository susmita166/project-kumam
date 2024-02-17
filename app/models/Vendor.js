const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require("../../util/database");
const logger = require('../../util/logger');
const moment = require('moment');

class Vendor extends Model {
    static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";

    static async createVendor(vendorData,userDetail){
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        return await Vendor.create({
            name: vendorData.name,
            district_id: vendorData.district_id,
            gst_number: vendorData.gst_number,
            gst_certificate_file_name: vendorData.gst_certificate_file_name,
            mobile: vendorData.mobile,
            email: vendorData.email,
            police_station: vendorData.police_station,
            village: vendorData.village,
            locality: vendorData. locality,
            street_address: vendorData. street_address,
            pincode: vendorData.pincode,
            cp_name: vendorData.cp_name,
            cp_designation: vendorData.cp_designation,
            cp_aadhaar_number: vendorData.cp_aadhaar_number,
            cp_aadhaar_file_name: vendorData.cp_aadhaar_file_name,
            cp_mobile: vendorData.cp_mobile,
            cp_email: vendorData.cp_email,
            status: vendorData.status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
            created_by: userDetail.id,
			created_at: currentDate,
			updated_by: userDetail.id,
			updated_at: currentDate,
        }).then(data => {
			return true;
		}).catch(err => {
			logger.error("Unable to create vendor.");
			logger.error(err);
			return false;
		});
    }

    static async fetchVendorList(){
        return await Vendor.findAll({
            attributes:{exclude:[ "updated_by", "created_at", "updated_at"]},
            where:{
                status: { [Op.ne]: this.STATUS_DELETED },
                created_by: [1, 19]
            },
            raw: true
        }).then(vendors => {
            vendors.forEach(vendor => {
                vendor.created_by = (vendor.created_by === 1) ? 'Admin' : 'ULB';
            });
            return vendors;
        });
    }


    static async vendorDetails(id){
        return await Vendor.findOne({
            attributes:{exclude:["created_by", "updated_by", "created_at", "updated_at"]},
            where:{
                id: id,
                status: { [Op.ne]: this.STATUS_DELETED
            }
        }
        }).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to retrieve Vendor details.");
			logger.error(err);
			return null;
		});
    }

    static async vendorUpdate(vendorData, userDetail){
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        return await Vendor.update({
            name: vendorData.name,
            gst_number: vendorData.gst_number,
            gst_certificate_file_name: vendorData.gst_certificate_file_name,
            mobile: vendorData.mobile,
            email: vendorData.email,
            district_id: vendorData.district_id,
            police_station: vendorData.police_station,
            village: vendorData.village,
            locality: vendorData. locality,
            street_address: vendorData. street_address,
            pincode: vendorData.pincode,
            cp_name: vendorData.cp_name,
            cp_designation: vendorData.cp_designation,
            cp_aadhaar_number: vendorData.cp_aadhaar_number,
            cp_aadhaar_file_name: vendorData.cp_aadhaar_file_name,
            cp_mobile: vendorData.cp_mobile,
            cp_email: vendorData.cp_email,
            status: vendorData.status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
            updated_by: userDetail.id,
			updated_at: currentDate,
        },{
            where:{
                id:vendorData.id,
                status:{[Op.ne]: this.STATUS_DELETED},
            }
        }).then(data=>{ return true })
        .catch(err=>{
            logger.error("Unable to edit vendor data.");
			logger.error(err);
			return false;
        })
    }

    static async vendorDelete(id,userDetail){
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        return await Vendor.update({
			status: this.STATUS_DELETED,
			updated_by: userDetail.id,
			updated_at: currentDate
		}, {
			where: {
				id: id,
				created_by: userDetail.id,
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to delete vendor.");
			logger.error(err);
			return false;
		});
    }

    static async countAllVendor(){
        return await Vendor.count({
            where: {
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        }).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to count vendor list.");
			logger.error(err);
			return 0;
		});
    }
}

Vendor.init({
    id: {
		type: DataTypes.BIGINT.UNSIGNED,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	created_by: {
		type: DataTypes.BIGINT.UNSIGNED,
		allowNull: false,
		defaultValue: 0
	},
	created_at: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	updated_by: {
		type: DataTypes.BIGINT.UNSIGNED,
		allowNull: false,
		defaultValue: 0
	},
	updated_at: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	status: {
		type: DataTypes.ENUM(['0', '1', '2']),
		comment: "0 (Archived), 1 (Active), 2 (Inactive)",
		allowNull: false,
		defaultValue: "1"
	}, 
    name: {
        type:DataTypes.STRING(255),
        allowNull: false
    },
    gst_number: {
        type:DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    gst_certificate_file_name: {
        type:DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    mobile: {
        type:DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    email: {
        type:DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    district_id: {
        type:DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    police_station: {
        type:DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    village: {
        type:DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    locality: {
        type:DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    street_address: {
        type:DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    pincode: {
        type:DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    cp_name: {
        type:DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    cp_designation: {
        type:DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    cp_aadhaar_number: {
        type:DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    cp_aadhaar_file_name: {
        type:DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    cp_mobile: {
        type:DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    cp_email: {
        type:DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    } 
},{
	sequelize,
	modelName: 'm_vendors',
	timestamps: false
})

module.exports = Vendor;