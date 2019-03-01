var mysql = require('mysql');
var $conf = require('../conf/db.js');
var $util = require('../util/util.js');
var $sql = require('./checkinsql.js');

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
  getInBound: function(req, res, next) {
    var params = req.body,
        bounds = params.bounds,
        latrange = bounds.latrange,
        lngrange = bounds.lngrange;

    pool.getConnection(function(err, connection) {
      connection.query($sql.checkinByBound, [
        latrange[0],
        latrange[1],
        lngrange[0],
        lngrange[1]
      ], function (err, result) {
        if(typeof result === 'undefined') {
          res.json({
            code: 1,
            msg: '查询不到签到信息'
          })
          connection.release();
          return ;
        }

        // var checkinlocationmap = {};
        // result.forEach(item => {
        //   if(!checkinlocationmap[item.lid]) {
        //     checkinlocationmap[item.lid] = {
        //       lid: item.lid,
        //       weight: 0,
        //       lat: undefined,
        //       lng: undefined,
        //       usermap: {}
        //     };
        //   }
        //   if(!checkinlocationmap[item.lid]['usermap'][item.uid]) {
        //     checkinlocationmap[item.lid]['usermap'][item.uid] = {
        //       uid: item.uid,
        //       weight: 0,
        //       records: []
        //     }
        //   }
        //   var lidobjinmap = checkinlocationmap[item.lid];
        //   lidobjinmap.weight ++;
        //   lidobjinmap.lat = +item.lat;
        //   lidobjinmap.lng = +item.lng;
        //   lidobjinmap.usermap[item.uid].weight ++;
        //   lidobjinmap.usermap[item.uid].records.push(item);
        //   checkinlocationmap[item.lid] = lidobjinmap;
        // })
        // var locationsmap = Object.values(checkinlocationmap);
        // locationsmap.forEach(item => {
        //   item.usermap = Object.values(item.usermap)
        // })

        res.json({
          code: 200,
          data: result
        })
        connection.release();
      })
    });


  },
  getByLocation: function(req, res, next) {
    var lid = +req.query.lid;

    pool.getConnection(function(err, connection) {
      connection.query($sql.checkinByLocationId, [lid], function (err, result) {
        if(typeof result === 'undefined') {
          res.json({
            code: 1,
            msg: '获取签到记录失败'
          });
          connection.release();
          return ;
        }
        result = result.map(item => {
          item.lat = +item.lat;
          item.lng = +item.lng;
          item.time = +item.time;
          
          return item;
        })
        res.json({
          code: 200,
          data: result,
          lid
        })
        connection.release();
      });     
    });
  },
}