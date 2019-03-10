var express = require('express');
var request = require('request');
var router = express.Router();
const fs = require('fs');
const readline = require('readline');
const path = require('path');
let checkinfilepath = path.join(__dirname, '../data/checkin.txt')

var checkin = require('../checkin/checkin.js');
var location = require('../location/location.js');
var edge = require('../edge/edge.js');


router.post('/checkin/bound',  (req, res, next) => {
	checkin.getInBound(req, res, next);
})

// router.post('/edges/users', (req, res, next) => {
// 	edge.getEdgesByOneSide(req, res, next);
// })

router.post('/checkin/total/users', (req, res, next) => {
	var params = req.body,
		uids = params.uids;

	var promises = uids.map(item => {
		return new Promise((resolve, reject) => {
			checkin.getCheckinTotal(item, resolve, reject);
		})
	})

		Promise.all(promises)
		.then(allcount => {
			res.json({
				code: 200,
				data: allcount
			})
		})
		.catch(err => {
			res.json({
				code: 1,
				msg: err
			})
			console.log(err)
		})
})

router.get('/location/hotspots', (req, res, next) => {
	location.getHotspots(req, res, next);
})

router.get('/checkin/bylid', (req, res, next) => {
	checkin.getByLocation(req, res, next)
})

router.post('/checkins/locationsbyusers', (req, res, next) => {
	var params = req.body,
		uids = params.users;

	var promises = uids.map(item => {
		return new Promise((resolve, reject) => {
			checkin.getCheckinsByUid(item, resolve, reject);
		})
	})

	var alllocations = [];
		Promise.all(promises)
		.then(result => {
			result.forEach(locations => {
				alllocations.push(...locations);
			})

			res.json({
				code: 200,
				data: alllocations
			})
		})
		.catch(err => {
			res.json({
				code: 1,
				msg: err
			})
			console.log(err)
		})

})

router.post('/generate/locations', (req, res, next) => {
	var params = req.body,
			userid = params.userid,
			hotscale = params.hotscale,
			locations = params.locations;

	res.json({
		params,
		userid,
		hotscale,
		locations
	})
})



// router.get('/location/heat', (req, res, next) => {
// 		location.getLocationHeat(req, res, next);
// })

// router.post('/location/inboundlocations', (req, res, next) => {
// 	location.getLocationInBound(req, res, next);
// })

// router.post('/location/inboundcheckins', (req, res, next) => {
// 	checkin.getInBound(req, res, next);
// })

// router.get('/location/checkin', (req, res, next) => {
// 	checkin.getByLocation(req, res, next);
// })

module.exports = router;


