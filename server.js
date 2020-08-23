// server.js

/**
 * Required External Modules
 */
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request-promise');
const mysql = require('mysql');

/**
 * App Variables
 */

const app = express()
const connection = mysql.createConnection({
  host: '147.102.19.135',
  user: 'exams',
  password: 'exams',
  database: 'exams',
})

var message = 'Η εφαρμογή λειτουργεί με τον εξής τρόπο. Στις δύο παραπάνω φόρμες επιλέγετε ένα εύρος ημερομηνιών. Πατώντας το κουμπί θα μεταφερθείτε σε νέα σελίδα οπου θα απεικονίζεται ένας χάρτης. Στον χάρτη αυτόν θα υπάρχει ένα marker για κάθε είδος καιρού. Το marker αυτό βρίσκεται στις συντεταγμένες της ομάδας κυψελών, για τις οποίες για τον συγκεκριμένο καιρό καταγράφηκαν οι περισσότεροι χρήστες εντός του χρονικού διαστήματος που έχετε επιλέξει. Κάτω από τον χάρτη θα υπάρχει ένα κουμπί που σας μεταφέρει πάλι εδώ ώστε να ορίσετε νέες ημερομηνίες.'

var mun_coords = {
  "AMP": [40.65299762, 22.9099631],
  "DEL": [40.63925761, 22.85594737],
  "KAL": [40.56541664, 22.96420797],
  "KOR": [40.66343323, 22.90797514],
  "NEA": [40.64323987, 22.95411328],
  "ORA": [40.6923426, 22.81780393],
  "PAU": [40.65494711, 22.95257112],
  "PUL": [40.56297974, 22.97745006],
  "THER": [40.5075, 22.97941666],
  "THES": [40.592048, 22.96648439]
}


/**
 *  App Configuration
 */

app.use(express.static('public'))
app.use(express.static('node_modules'))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs')



/**
 * Routes Definitions
 */

app.get('/', function (req, res) {
  res.render('server', { message: message });
})


app.post('/', function (req, res) {

  if (req.body.date1 === '' || req.body.date2 === '') {
    res.render('server', { message: message + '\n\nΚΑΤΙ ΠΗΓΕ ΛΑΘΟΣ ΔΟΚΙΜΑΣΤΕ ΞΑΝΑ!' });
    return
  }

  connection.query(`select cell_municipality, distinct_users, event_date, time_period from table1 where event_date >= ${req.body.date1} and event_date <= ${req.body.date2} limit 200`, async function (err, rows, fields) {
    if (err) throw err


    var stats = {
      "light rain": { "AMP": 0, "DEL": 0, "KAL": 0, "KOR": 0, "NEA": 0, "ORA": 0, "PAU": 0, "PUL": 0, "THER": 0, "THES": 0 },
      "moderate rain": { "AMP": 0, "DEL": 0, "KAL": 0, "KOR": 0, "NEA": 0, "ORA": 0, "PAU": 0, "PUL": 0, "THER": 0, "THES": 0 },
      "heavy intensity rain": { "AMP": 0, "DEL": 0, "KAL": 0, "KOR": 0, "NEA": 0, "ORA": 0, "PAU": 0, "PUL": 0, "THER": 0, "THES": 0 },
      "very heavy rain": { "AMP": 0, "DEL": 0, "KAL": 0, "KOR": 0, "NEA": 0, "ORA": 0, "PAU": 0, "PUL": 0, "THER": 0, "THES": 0 },
      "fog": { "AMP": 0, "DEL": 0, "KAL": 0, "KOR": 0, "NEA": 0, "ORA": 0, "PAU": 0, "PUL": 0, "THER": 0, "THES": 0 },
      "dust": { "AMP": 0, "DEL": 0, "KAL": 0, "KOR": 0, "NEA": 0, "ORA": 0, "PAU": 0, "PUL": 0, "THER": 0, "THES": 0 },
      "few clouds: 11-25%": { "AMP": 0, "DEL": 0, "KAL": 0, "KOR": 0, "NEA": 0, "ORA": 0, "PAU": 0, "PUL": 0, "THER": 0, "THES": 0 },
      "scattered clouds: 25-50%": { "AMP": 0, "DEL": 0, "KAL": 0, "KOR": 0, "NEA": 0, "ORA": 0, "PAU": 0, "PUL": 0, "THER": 0, "THES": 0 },
      "broken clouds: 51-84%": { "AMP": 0, "DEL": 0, "KAL": 0, "KOR": 0, "NEA": 0, "ORA": 0, "PAU": 0, "PUL": 0, "THER": 0, "THES": 0 },
      "overcast clouds: 85-100%": { "AMP": 0, "DEL": 0, "KAL": 0, "KOR": 0, "NEA": 0, "ORA": 0, "PAU": 0, "PUL": 0, "THER": 0, "THES": 0 },
      "clear sky": { "AMP": 0, "DEL": 0, "KAL": 0, "KOR": 0, "NEA": 0, "ORA": 0, "PAU": 0, "PUL": 0, "THER": 0, "THES": 0 }
    }

    async function getWeath(row) {

      var tp
      if (row.time_period < 10) tp = "0" + String(row.time_period)
      else tp = String(row.time_period)
      switch (row.cell_municipality) {
        case "AMPELOKIPON - MENEMENIS":
          await callService(row.event_date, tp, "AMP", row.distinct_users);
          break;
        case "DELTA":
          await callService(row.event_date, tp, "DEL", row.distinct_users);
          break;
        case "KALAMARIAS":
          await callService(row.event_date, tp, "KAL", row.distinct_users);
          break;
        case "KORDELIOU - EUOSMOU":
          await callService(row.event_date, tp, "KOR", row.distinct_users);
          break;
        case "NEAPOLIS - SUKEON":
          await callService(row.event_date, tp, "NEA", row.distinct_users);
          break;
        case "ORAIOKASTROU":
          await callService(row.event_date, tp, "ORA", row.distinct_users);
          break;
        case "PAULOU MELA":
          await callService(row.event_date, tp, "PAU", row.distinct_users);
          break;
        case "PULAIAS - HORTIATI":
          await callService(row.event_date, tp, "PUL", row.distinct_users);
          break;
        case "THERMIS":
          await callService(row.event_date, tp, "THER", row.distinct_users);
          break;
        case "THESSALONIKIS":
          await callService(row.event_date, tp, "THES", row.distinct_users);
          break;
      }
    }

    async function callService(date, hour, cell, users) {
      var url = "http://147.102.16.156:8090/services/getWeatherDisc/" + date + "/" + hour;
      let promise_req = request({
        "uri": url,
      }).then(function (body) {
        let weather = body.trim()
        if (weather === '') return;
        return stats[weather][cell] += users;
      }).catch((err, body) => {
        throw (err)
      })
      await promise_req
    };

    var finalStats = new Promise(async function rowsWork(resolve) {
      await Promise.all(rows.map(async (row) => {
        await getWeath(row);
      }))
      resolve(stats)
    })

    function findMaxTraffic(stats) {
      var weath = Object.keys(stats);
      var objtraff = Object.values(stats);

      var traff = [];
      var i;

      for (i = 0; i < 11; i++) {
        var max = 0;
        var mun = '';
        Object.entries(objtraff[i]).forEach((value) => {
          if (value[1] >= max) {
            max = value[1];
            mun = value[0];
          }
        })
        traff.push([weath[i], mun])
      }
      return traff
    }

    function renderMap(result) {
      res.render('map', {
        light_rain_name: "light_rain",
        light_rain_coords: mun_coords[result[0][1]],
        moderate_rain_name: "moderate_rain",
        moderate_rain_coords: mun_coords[result[1][1]],
        heavy_intensity_rain_name: "heavy_intensity_rain",
        heavy_intensity_rain_coords: mun_coords[result[2][1]],
        very_heavy_rain_name: "very_heavy_rain",
        very_heavy_rain_coords: mun_coords[result[3][1]],
        fog_name: "fog",
        fog_coords: mun_coords[result[4][1]],
        dust_name: "dust",
        dust_coords: mun_coords[result[5][1]],
        few_clouds_name: "few_clouds",
        few_clouds_coords: mun_coords[result[6][1]],
        scattered_clouds_name: "scattered_clouds",
        scattered_clouds_coords: mun_coords[result[7][1]],
        broken_clouds_name: "broken_clouds",
        broken_clouds_coords: mun_coords[result[8][1]],
        overcast_clouds_name: "overcast_clouds",
        overcast_clouds_coords: mun_coords[result[9][1]],
        clear_sky_name: "clear_sky",
        clear_sky_coords: mun_coords[result[10][1]],
      }
      )
    }


    finalStats.then(result => { return findMaxTraffic(result) }).catch(error => { throw error })
      .then((result) => renderMap(result))

  });

})


/**
 * Server Activation
 */


app.listen(8000, function () {
  console.log('Appathon App is listening on port 8000!')
})
