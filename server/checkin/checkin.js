var path = require('path');
const fs = require('fs');
var mysql = require('mysql');
var $conf = require('../conf/db.js');
var $util = require('../util/util.js');
var $sql = require('./checkinsql.js');

const readline = require('readline');
let checkinfilepath = path.join(__dirname, '../data/checkin.txt')


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
  initCheckinData: function(req, res, next, linecount, line) {
    pool.getConnection(function(err, connection) {
      var infos = line.split('\t');
      var date = new Date(infos[1]);

      connection.query($sql.checkinInsert, [
        linecount,
        +infos[0],
        `${date.getTime()}`,
        +infos[4],
        infos[2],
        infos[3],
        ''
      ], function (err, result) {
        if(typeof result === 'undefined') {
          console.log('saveCash 查询不到用户信息', err);
          // res.json({
          //   code: 2,
          //   msg: err
          // })
          connection.release();
          return ;
        }
        // res.json({
        //   code: 200,
        //   data: result
        // })
        connection.release();
      })
    });


  }
}