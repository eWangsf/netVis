var mysql = require('mysql');
var $conf = require('../conf/db.js');
var $util = require('../util/util.js');
var $sql = require('./edgesql.js');

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
  getEdgesByOneSide: function(req, res, next) {
    var params = req.body,
        uids = params.uids;

    pool.getConnection(function(err, connection) {
      res.json({
        code: 200,
        data: {
          uids
        }
      })
      connection.release();
      // connection.query($sql.edgeBySourceUid, [
      //   latrange[0],
      //   latrange[1],
      //   lngrange[0],
      //   lngrange[1]
      // ], function (err, result) {
      //   if(typeof result === 'undefined') {
      //     res.json({
      //       code: 1,
      //       msg: '查询不到签到信息'
      //     })
      //     connection.release();
      //     return ;
      //   }

      //   res.json({
      //     code: 200,
      //     data: result
      //   })
      //   connection.release();
      // })
    });


  },
}