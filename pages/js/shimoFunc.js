// 소스출처 : http://www.kma.go.kr/weather/forecast/digital_forecast.jsp  내부에 있음
// 기상청에서 이걸 왜 공식적으로 공개하지 않을까?
//
// (사용 예)
// var rs = dfs_xy_conv("toLL","60","127");
// console.log(rs.lat, rs.lng);
//
//<!--
//
// LCC DFS 좌표변환을 위한 기초 자료
//
var RE = 6371.00877; // 지구 반경(km)
var GRID = 5.0; // 격자 간격(km)
var SLAT1 = 30.0; // 투영 위도1(degree)
var SLAT2 = 60.0; // 투영 위도2(degree)
var OLON = 126.0; // 기준점 경도(degree)
var OLAT = 38.0; // 기준점 위도(degree)
var XO = 43; // 기준점 X좌표(GRID)
var YO = 136; // 기1준점 Y좌표(GRID)
//
// LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
//

function dfs_xy_conv(code, v1, v2) {
  var DEGRAD = Math.PI / 180.0;
  var RADDEG = 180.0 / Math.PI;

  var re = RE / GRID;
  var slat1 = SLAT1 * DEGRAD;
  var slat2 = SLAT2 * DEGRAD;
  var olon = OLON * DEGRAD;
  var olat = OLAT * DEGRAD;

  var sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);
  var rs = {};
  if (code == "toXY") {
    rs["lat"] = v1;
    rs["lng"] = v2;
    var ra = Math.tan(Math.PI * 0.25 + v1 * DEGRAD * 0.5);
    ra = (re * sf) / Math.pow(ra, sn);
    var theta = v2 * DEGRAD - olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;
    rs["x"] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    rs["y"] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
  } else {
    rs["x"] = v1;
    rs["y"] = v2;
    var xn = v1 - XO;
    var yn = ro - v2 + YO;
    ra = Math.sqrt(xn * xn + yn * yn);
    if (sn < 0.0) -ra;
    var alat = Math.pow((re * sf) / ra, 1.0 / sn);
    alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

    if (Math.abs(xn) <= 0.0) {
      theta = 0.0;
    } else {
      if (Math.abs(yn) <= 0.0) {
        theta = Math.PI * 0.5;
        if (xn < 0.0) -theta;
      } else theta = Math.atan2(xn, yn);
    }
    var alon = theta / sn + olon;
    rs["lat"] = alat * RADDEG;
    rs["lng"] = alon * RADDEG;
  }
  return rs;
}

/////////////////////////////////////////////////////////////////////////////////////////// 절취선 ////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////// 절취선 ////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////// 절취선 ////////////////////////////////////////////////////////////////////////////////////

function currLocationVal() {
  const status = document.querySelector("#status");
  const locationVal = document.querySelector("#locationVal");

  locationVal.textContent = "";

  function success(position) {
    const testt = document.getElementById("testt");
    const fullTime = new Date();
    const year = fullTime.getFullYear();
    const month = fullTime.getMonth();
    const day = fullTime.getDate();

    const elem = document.getElementById("par");
    const baseDate = document.getElementById("baseDate");
    const fcstDate = document.getElementById("fcstDate");
    const fcstWrap = document.querySelectorAll(".wrap_fsctDate");
    const currShimoVal = document.getElementById("currShimoVal");

    const promise1 = new Promise(function (resolve, reject) {
      setTimeout(function () {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const lati1 = latitude.toFixed(8);
        const long1 = longitude.toFixed(8);

        console.log(long1);
        console.log(typeof long1);

        console.log(
          `https://apis.data.go.kr/1360000/FrstFcstInfoService/getFrstOcurFcst?serviceKey=bSXkKy%2Byc2VF2SlqdhqFAD872EcSbjlw5ltHOg3gWTx0E64wPm13cEZr75MW3bZtMx%2B3IaQaTBasqSVqkY6WBw%3D%3D&numOfRows=10&pageNo=1&BASE_DATE=20231212&BASE_TIME=0500&LAT=${lati1}&LON=${long1}.0&dataType=JSON`
        );

        status.textContent = "";

        // Switch a latitude and longtitude val to gisangchong location val
        const switchToGrid = dfs_xy_conv("toXY", latitude, longitude);
        //  console.log(switchToGrid.x, switchToGrid.y);
        const locationX = switchToGrid.x;
        const locationY = switchToGrid.y;
        locationVal.innerHTML = [switchToGrid.x, switchToGrid.y];
        // end location

        const xhr = new XMLHttpRequest(),
          method = "GET",
          url = `https://apis.data.go.kr/1360000/FrstFcstInfoService/getFrstOcurFcst?serviceKey=bSXkKy%2Byc2VF2SlqdhqFAD872EcSbjlw5ltHOg3gWTx0E64wPm13cEZr75MW3bZtMx%2B3IaQaTBasqSVqkY6WBw%3D%3D&numOfRows=10&pageNo=1&BASE_DATE=20231212&BASE_TIME=0500&LAT=${lati1}&LON=${long1}.0&dataType=JSON`;
        //          url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=HDxvF%2Bq4PsIMtuZBoqLHonXDQ0AG1YZjdrPoUeqeC922ITebwGCeM9cPfgC%2Bpz%2BsbUUtt1H5RLcOYuo3zoS6Jg%3D%3D&numOfRows=20&pageNo=1&base_date=20231212&base_time=0500&dataType=JSON&nx=${locationX}&ny=${locationY}`;
        xhr.open(method, url, true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);

            const res = xhr.responseText;
            const parseData = JSON.parse(res);
            const baseValue = parseData.response.body.items.item[0].BASE_DATE;
            const fcstValue = parseData.response.body.items.item[0].FCST_DATE;
            const shimoValue = parseData.response.body.items.item[0].VALUE;

            baseDate.innerHTML = baseValue;
            fcstWrap.innerHTML = fcstValue;
            currShimoVal.innerHTML = shimoValue;

            for (const t of fcstWrap) {
              t.innerHTML = fcstValue;
            }

            resolve("resolve");
          }
        };
        xhr.send();
      }, 300);
    });

    promise1.then(function (value) {
      //   console.log(value);
    });
  }

  function error() {
    status.textContent = "ㅈㅅ 님 어디있는지 몰름";
  }

  if (!navigator.geolocation) {
    status.textContent = "ㅈㅅ 님 브라우저에서는 위치찾기가 않댐";
  } else {
    status.textContent = "위치 찾는 중!!!!!";
    navigator.geolocation.getCurrentPosition(success, error);
  }
}
window.onload = currLocationVal();
