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
        result = result.map(item => {
          return {
            id: item.id,
            lat: +item.lat,
            lng: +item.lng,
            weight: +item.weight
          }
        })
        res.json({
          code: 200,
          data: result
        })
        connection.release();
      });
    });
  },
}