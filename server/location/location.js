var path = require('path');
const fs = require('fs');
var mysql = require('mysql');
var $conf = require('../conf/db.js');
var $util = require('../util/util.js');
var $sql = require('./locationsql.js');

var pool = mysql.createPool($util.extend({}, $conf.mysql));

var jsonWrite = function (res, ret) {
  if(typeof ret === 'undefined') {
    res.json({
      code:'1',
      msg: '操作失败'
    });
  } else {
    res.json(ret);
  }
};

module.exports = {
  getLocationHeat: function(req, res, next) {
    var pageSize = +req.query.pageSize,
        offset = +req.query.offset;

    pool.getConnection(function(err, connection) {
      connection.query($sql.getLocationByPageSizeAndOffset, [pageSize, offset], function (err, result) {
        if(typeof result === 'undefined') {
          res.json({
            code: 1,
            msg: '获取热力图失败'
          })
          connection.release();
          return ;
        }
        console.log(pageSize, offset, result.length);
        result = $util.mapLocations(result);
        res.json({
          code: 200,
          data: result
        })
        connection.release();
      });
    });
  },
  getLocationInBound: function(req, res, next) {
    var params = req.body;
    var latrange = params.latrange,
        lngrange = params.lngrange,
        bound_seed = params.bound_seed;

    pool.getConnection(function(err, connection) {
      connection.query($sql.getLocationInBound, [latrange[0], latrange[1], lngrange[0], lngrange[1]], function (err, result) {
        if(typeof result === 'undefined') {
          res.json({
            code: 1,
            msg: '获取打卡点失败'
          })
          connection.release();
          return ;
        }
        result = $util.mapLocations(result);

        res.json({
          code: 200,
          bound_seed: bound_seed,
          data: result
        });
        connection.release();
      });
    });

    
  },

  getHotspots: function(req, res, next) {

    pool.getConnection(function(err, connection) {
      connection.query($sql.getHotspots, function (err, result) {
        if(typeof result === 'undefined') {
          res.json({
            code: 1,
            msg: '获取热点信息失败'
          })
          connection.release();
          return ;
        }
        res.json({
          code: 200,
          data: result
        })
      });
    });
    


  }
}