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
  initCheckinData: function(req, res, next) {

    pool.getConnection(function(err, connection) {

      connection.query($sql.checkinAll, function (err, result) {
        if(typeof result === 'undefined') {
          console.log('saveCash 查询不到用户信息', userid, err);
          res.json({
            code: 2,
            msg: err
          })
          connection.release();
          return ;
        }
        res.json({
          code: 200,
          data: result
        })
        connection.release();

      })

    });


  }
}