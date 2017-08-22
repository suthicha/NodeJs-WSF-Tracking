'use strict';

var squel = require('squel');
var httpMsg = require('../core/httpMsg');
var helper = require('../core/helper');
var settings = require('../settings');

exports.get = function (req, resp, orderno) {

  try {

    if (!orderno) throw new Error("Input not valid");

    var sql = squel.select().from("SEBL1").field("ISNULL((SELECT TOP 1 VatRegistrationNo FROM slcu1 WHERE slcu1.CustomerCode=SEBL1.CustomerCode),'') AS TaxNo").field("'' AS BranchNo").field("ISNULL(JobNo,'') AS JobNo").field("ISNULL(BookingNo,'') AS BookingNo").field("ISNULL(CustomerCode,'') AS CustomerCode").field("ISNULL(CustomerName,'') AS CustomerName").field("ISNULL(UcrNo,'') AS CarrierBookingNo").field("ISNULL(OBLNo,'') AS OBL").field("ISNULL(BLNo,'') AS HBL").field("ISNULL(MasterJobNo,'') AS MasterJobNo").field("ISNULL(EtdDate, CONVERT(DATE,'19000101',112)) AS DepartureDate").field("ISNULL(MotherVesselName,'') AS MotherVessel").field("ISNULL(FeederVesselName,'') AS FeederVessel").field("ISNULL(EtaDate, CONVERT(DATE,'19000101',112)) AS ArrivalDate").field("ISNULL(ContainerNo,'') AS ContainerNo").field("ISNULL(DeliveryOrderReleaseDate, CONVERT(DATE,'19000101',112)) AS DeliveryDate").where(squel.expr().or("BookingNo = ?", orderno).or("UcrNo = ?", orderno).or("OBLNo = ?", orderno).or("BLNo = ?", orderno).or("MasterJobNo = ?", orderno)).toString();

    helper.execCommandWithConnection(req, resp, sql, settings.db2Config);
  } catch (ex) {
    httpMsg.show500(req, resp, ex);
  }
};
//# sourceMappingURL=order.js.map