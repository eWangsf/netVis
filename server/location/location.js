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
  locationInit: function(req, res, next, i) {
    pool.getConnection(function(err, connection) {

      connection.query($sql.locationById, [i], function (err, result) {
        if(result && result.length > 0) {
          var record = result[0];
          console.log(record.lid,record.lat, record.lng);
        } else {
          console.log(i, ' missed');
        }
        connection.release();
      });

        // connection.query($sql.checkinInsert, [
        //   linecount,
        //   +infos[0],
        //   `${date.getTime()}`,
        //   +infos[4],
        //   infos[2],
        //   infos[3],
        //   ''
        // ], function (err, result) {
        //   if(typeof result === 'undefined') {
        //     console.log('saveCash 查询不到用户信息', err);
        //     // res.json({
        //     //   code: 2,
        //     //   msg: err
        //     // })
        //     connection.release();
        //     return ;
        //   }
        //   // res.json({
        //   //   code: 200,
        //   //   data: result
        //   // })
        //   connection.release();
        // })
    });


  }
}