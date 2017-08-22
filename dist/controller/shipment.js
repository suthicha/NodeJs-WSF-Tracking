'use strict';

var squel = require('squel');
var db = require('../core/db');
var httpMsg = require('../core/httpMsg');
var helper = require('../core/helper');
var settings = require('../settings');

exports.checkExists = function (req, resp, callback) {
  try {
    var data = req.body;
    var sql = squel.select().from("SFT_Shipments").where(squel.expr().and("TaxNo = ?", data.TaxNo).and("BookingNo = ?", data.BookingNo).and("OBL = ?", data.OBL).and("HBL = ?", data.HBL).and("MasterJobNo = ?", data.MasterJobNo).and("Status <= ?", "99")).toString();

    db.executeSqlWithConnection(settings.dbConfig, sql, function (data, err) {
      if (err) {
        //httpMsg.show500(req, resp, err);
        callback(false);
      } else {
        callback(data.length >= 1 ? true : false);
      }
    });
  } catch (ex) {
    callback(false);
  }
};

exports.add = function (req, resp) {
  try {
    if (!req.body) throw new Error("Input not valid");
    var data = req.body;

    if (data) {
      var deptDate = new Date(data.DepartureDate);
      var arrivalDate = new Date(data.ArrivalDate);
      var deliveryDate = new Date(data.DeliveryDate);

      var sql = squel.insert().into("SFT_Shipments").set("MasterJobNo", helper.StringNull(data.MasterJobNo)).set("JobNo", helper.StringNull(data.JobNo)).set("TaxNo", helper.StringNull(data.TaxNo)).set("BranchNo", helper.StringNull(data.BranchNo)).set("BookingNo", helper.StringNull(data.BookingNo)).set("CustomerNo", helper.StringNull(data.CustomerNo)).set("CustomerName", helper.StringNull(data.CustomerName)).set("CarrierBookingNo", helper.StringNull(data.CarrierBookingNo)).set("OBL", helper.StringNull(data.OBL)).set("HBL", helper.StringNull(data.HBL)).set("DepartureDate", deptDate.getFullYear() + "-" + (deptDate.getMonth() + 1) + "-" + deptDate.getDate()).set("MotherVessel", helper.StringNull(data.MotherVessel)).set("FeederVessel", helper.StringNull(data.FeederVessel)).set("ArrivalDate", arrivalDate.getFullYear() + "-" + (arrivalDate.getMonth() + 1) + "-" + arrivalDate.getDate()).set("ContainerNo", helper.StringNull(data.ContainerNo)).set("DeliveryDate", deliveryDate.getFullYear() + "-" + (deliveryDate.getMonth() + 1) + "-" + deliveryDate.getDate()).set("CreateBy", helper.StringNull(data.CreateBy)).set("CreateDate", "GETDATE()", { dontQuote: true }).set("UpdateBy", "").set("UpdateDate", "19000101").set("Status", "1").set("Remark", helper.StringNull(data.Remark)).toString();
      console.log(sql);
      helper.execCommandWithConnection(req, resp, sql, settings.dbConfig);
    }
  } catch (ex) {
    httpMsg.show500(req, resp, ex);
  }
};

exports.update = function (req, resp) {

  try {
    if (!req.body) throw new Error("Input not valid");
    var data = req.body;

    if (data) {
      var deptDate = new Date(data.DepartureDate);
      var arrivalDate = new Date(data.ArrivalDate);
      var deliveryDate = new Date(data.DeliveryDate);

      var sql = squel.update().table("SFT_Shipments").set("MasterJobNo", helper.StringNull(data.MasterJobNo)).set("JobNo", helper.StringNull(data.JobNo)).set("TaxNo", helper.StringNull(data.TaxNo)).set("BranchNo", helper.StringNull(data.BranchNo)).set("BookingNo", helper.StringNull(data.BookingNo)).set("CustomerNo", helper.StringNull(data.CustomerNo)).set("CustomerName", helper.StringNull(data.CustomerName)).set("CarrierBookingNo", helper.StringNull(data.CarrierBookingNo)).set("OBL", helper.StringNull(data.OBL)).set("HBL", helper.StringNull(data.HBL)).set("DepartureDate", deptDate.getFullYear() + "-" + (deptDate.getMonth() + 1) + "-" + deptDate.getDate()).set("MotherVessel", helper.StringNull(data.MotherVessel)).set("FeederVessel", helper.StringNull(data.FeederVessel)).set("ArrivalDate", arrivalDate.getFullYear() + "-" + (arrivalDate.getMonth() + 1) + "-" + arrivalDate.getDate()).set("ContainerNo", helper.StringNull(data.ContainerNo)).set("DeliveryDate", deliveryDate.getFullYear() + "-" + (deliveryDate.getMonth() + 1) + "-" + deliveryDate.getDate()).set("UpdateBy", helper.StringNull(data.UpdateBy)).set("UpdateDate", "GETDATE()", { dontQuote: true }).set("Remark", helper.StringNull(data.Remark)).where(squel.expr().and("TaxNo = ?", data.TaxNo).and("BookingNo = ?", data.BookingNo).and("OBL = ?", data.OBL).and("HBL = ?", data.HBL).and("MasterJobNo = ?", data.MasterJobNo)).toString();

      helper.execCommandWithConnection(req, resp, sql, settings.dbConfig);
    }
  } catch (ex) {
    httpMsg.show500(req, resp, ex);
  }
};

exports.delete = function (req, resp) {

  try {
    if (!req.body) throw new Error("Input not valid");
    var data = req.body;

    if (data) {
      var sql = squel.update().table("SFT_Shipments").set("Status", "99").where("TrxNo = ?", data.TrxNo).toString();

      helper.execCommandWithConnection(req, resp, sql, settings.dbConfig);
    }
  } catch (ex) {
    httpMsg.show500(req, resp, ex);
  }
};

exports.get = function (req, resp, taxno, orderno) {
  try {
    if (!taxno) throw new Error("Input not valid");

    var sql = squel.select().from("SFT_Shipments").where("TaxNo = ?", taxno).where("Status < ?", "99").where(squel.expr().or("BookingNo = ?", orderno).or("CarrierBookingNo = ?", orderno).or("OBL = ?", orderno).or("HBL = ?", orderno)).toString();

    helper.execCommandWithConnection(req, resp, sql, settings.dbConfig);
  } catch (ex) {
    httpMsg.show500(req, resp, ex);
  }
};
//# sourceMappingURL=shipment.js.map