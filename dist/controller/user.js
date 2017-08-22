'use strict';

var jwt = require('jsonwebtoken');
var squel = require('squel');
var db = require('../core/db');
var httpMsg = require('../core/httpMsg');
var helper = require('../core/helper');
var settings = require('../settings');

exports.authenticate = function (req, resp) {
    try {
        if (!req.body) throw new Error("Input not valid");
        var data = req.body;

        if (data) {

            var sql = squel.select().from("SFT_Users").field("Username").field("Fullname").field("UserType").field("TaxNo").field("BranchNo").field("CompanyName").field("Email").where("Username = ?", data.Username).where("UPassword = ?", data.Password).where("UserStatus = ?", "A").toString();

            db.executeSql(sql, function (callback, err) {
                if (err) {
                    httpMsg.show500(req, resp, err);
                } else {
                    if (data && callback.length > 0) {
                        var user = callback[0];
                        if (user.Username === req.body.Username) {
                            var token = jwt.sign({
                                Username: user.Username,
                                FullName: user.Fullname
                            }, settings.secert, {
                                expiresIn: 86400 // expires in 24 hours
                            });

                            resp.writeHead(200, { "Content-Type": "application/json" });
                            resp.write(JSON.stringify({
                                Success: true,
                                Fullname: user.Fullname,
                                UserType: user.UserType,
                                TaxNo: user.TaxNo,
                                BranchNo: user.BranchNo,
                                Company: user.CompanyName,
                                Token: token }));
                            resp.end();
                        } else {
                            httpMsg.sendAuthFail(req, resp, "Username not match.");
                        }
                    } else {
                        httpMsg.sendAuthFail(req, resp, "Find not found Username: " + data.Username + " or Password incorrect.");
                    }
                }
            });
        } else {
            throw new Error("Input not valid");
        }
    } catch (ex) {
        httpMsg.show500(req, resp, ex);
    }
};

exports.add = function (req, resp) {
    try {
        if (!req.body) throw new Error("Input not valid");
        var data = req.body;

        if (data) {

            var sql = squel.insert().into("SFT_Users").set("Username", helper.StringNull(data.Username)).set("UPassword", helper.StringNull(data.UPassword)).set("FullName", helper.StringNull(data.Fullname)).set("Email", helper.StringNull(data.Email)).set("UserType", helper.StringNull(data.UserType)).set("TaxNo", helper.StringNull(data.TaxNo)).set("BranchNo", helper.StringNull(data.BranchNo)).set("CompanyName", helper.StringNull(data.CompanyName)).set("RegisterDate", "GETDATE()", { dontQuote: true }).set("ExpiredDate", "DATEADD(year,10,GETDATE())", { dontQuote: true }).set("UserStatus", "A").toString();
            helper.execCommandWithConnection(req, resp, sql, settings.dbConfig);
        } else {
            throw new Error("Input not valid");
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

            var sql = squel.update().table("SFT_Users").set("UPassword", helper.StringNull(data.UPassword)).set("FullName", helper.StringNull(data.Fullname)).set("Email", helper.StringNull(data.Email)).set("UserType", helper.StringNull(data.UserType)).set("TaxNo", helper.StringNull(data.TaxNo)).set("BranchNo", helper.StringNull(data.BranchNo)).set("CompanyName", helper.StringNull(data.CompanyName)).where("TrxNo = ?", data.TrxNo).toString();
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

            var sql = squel.update().table("SFT_Users").set("UserStatus", "I").where("TrxNo = ?", data.TrxNo).toString();
            helper.execCommandWithConnection(req, resp, sql, settings.dbConfig);
        }
    } catch (ex) {
        httpMsg.show500(req, resp, ex);
    }
};

exports.getList = function (req, resp) {

    var sql = squel.select().from("SFT_Users").field("Username").field("Fullname").field("UserType").field("TaxNo").field("BranchNo").field("CompanyName").field("Email").field("RegisterDate").field("ExpiredDate").field("TrxNo").where("UserStatus = ?", "A").toString();
    helper.execCommandWithConnection(req, resp, sql, settings.dbConfig);
};
//# sourceMappingURL=user.js.map