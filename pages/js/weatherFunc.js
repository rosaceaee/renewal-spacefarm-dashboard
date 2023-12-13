// 소스 출처0: https://fronteer.kr/service/kmaxy (감사합니다 ㅠㅠ)
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
    const month = fullTime.getMonth() + 1;
    const day = fullTime.getDate();

    const elem = document.getElementById("par");
    const date = document.getElementById("baseDate");

    const currSky = document.getElementById("currSky");

    const currTmp = document.getElementById("currTmp");
    const currREH = document.getElementById("currREH");
    const currTmn = document.getElementById("currTmn");
    const currTmx = document.getElementById("currTmx");
    const currWsd = document.getElementById("currWsd");
    const currPop = document.getElementById("currPop");
    const currSno = document.getElementById("currSno");
    const currSnoVal = document.getElementById("snoVal");

    const promise1 = new Promise(async function (resolve, reject) {
      alert("ㅈㅅ 좀만 기다려주셈");

      setTimeout(function () {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        status.textContent = "";

        // Switch a latitude and longtitude values to gisangchong location values
        const switchToGrid = dfs_xy_conv("toXY", latitude, longitude);
        console.log(switchToGrid.x, switchToGrid.y);
        const locationX = switchToGrid.x;
        const locationY = switchToGrid.y;
        locationVal.innerHTML = [switchToGrid.x, switchToGrid.y];
        // end set a latitude and longtitude values

        const xhr = new XMLHttpRequest(),
          method = "GET",
          url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=HDxvF%2Bq4PsIMtuZBoqLHonXDQ0AG1YZjdrPoUeqeC922ITebwGCeM9cPfgC%2Bpz%2BsbUUtt1H5RLcOYuo3zoS6Jg%3D%3D&numOfRows=20&pageNo=1&base_date=${year}${month}${day}&base_time=0500&dataType=JSON&nx=${locationX}&ny=${locationY}`;
        xhr.open(method, url, true);
        console.log(
          `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=HDxvF%2Bq4PsIMtuZBoqLHonXDQ0AG1YZjdrPoUeqeC922ITebwGCeM9cPfgC%2Bpz%2BsbUUtt1H5RLcOYuo3zoS6Jg%3D%3D&numOfRows=20&pageNo=1&base_date=${year}${month}${day}&base_time=0500&dataType=JSON&nx=${locationX}&ny=${locationY}`
        );
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);

            const res = xhr.responseText;
            const parseData = JSON.parse(res);
            const dateValue = parseData.response.body.items.item[0].baseDate;

            date.innerHTML = dateValue;

            function ChkSky() {
              //- 하늘상태(SKY) 코드 : 맑음(1), 구름많음(3), 흐림(4)
              const skyStatus = parseData.response.body.items.item[5].category;
              let skyVal = parseData.response.body.items.item[5].fcstValue;

              switch (skyVal) {
                case "1": {
                  currSky.innerHTML = `<div class="currSky-result result-sunny"><span>맑아요</span><svg fill="#fdf73f" height="200px" width="200px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M16,8c-4.4,0-8,3.6-8,8s3.6,8,8,8s8-3.6,8-8S20.4,8,16,8z"></path> <path d="M16,7c0.6,0,1-0.4,1-1V3c0-0.6-0.4-1-1-1s-1,0.4-1,1v3C15,6.6,15.4,7,16,7z"></path> <path d="M8.2,9.6c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3c0.4-0.4,0.4-1,0-1.4L7.5,6.1c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4L8.2,9.6 z"></path> <path d="M7,16c0-0.6-0.4-1-1-1H3c-0.6,0-1,0.4-1,1s0.4,1,1,1h3C6.6,17,7,16.6,7,16z"></path> <path d="M8.2,22.4l-2.1,2.1c-0.4,0.4-0.4,1,0,1.4c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l2.1-2.1c0.4-0.4,0.4-1,0-1.4 S8.6,22,8.2,22.4z"></path> <path d="M16,25c-0.6,0-1,0.4-1,1v3c0,0.6,0.4,1,1,1s1-0.4,1-1v-3C17,25.4,16.6,25,16,25z"></path> <path d="M23.8,22.4c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l2.1,2.1c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3c0.4-0.4,0.4-1,0-1.4 L23.8,22.4z"></path> <path d="M29,15h-3c-0.6,0-1,0.4-1,1s0.4,1,1,1h3c0.6,0,1-0.4,1-1S29.6,15,29,15z"></path> <path d="M23.1,9.9c0.3,0,0.5-0.1,0.7-0.3l2.1-2.1c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0l-2.1,2.1c-0.4,0.4-0.4,1,0,1.4 C22.6,9.8,22.8,9.9,23.1,9.9z"></path> </g> </g></svg></div>`;
                }
                case "3": {
                  currSky.innerHTML = `<div class="currSky-result result-semiCloudy"><span>구름이 많아요</span><svg fill="#5e536e" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 485.34 485.34" xml:space="preserve" stroke="#5e536e"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M89.472,275.122c-0.08-0.637-0.049-1.274-0.112-1.91c-33.377-15.01-56.732-48.514-56.732-87.418 c0-52.846,42.999-95.844,95.846-95.844c30.397,0,57.496,14.274,75.07,36.435c6.658-1.019,13.429-1.705,20.375-1.705 c6.149,0,12.203,0.557,18.21,1.385c-21.539-40.815-64.363-68.743-113.655-68.743C57.624,57.322,0,114.946,0,185.794 c0,47.779,26.271,89.471,65.064,111.602C71.932,288.776,80.072,281.144,89.472,275.122z"></path> <path d="M429.945,292.87c1.18-5.226,1.912-10.611,1.912-16.202c0-40.784-33.074-73.843-73.843-73.843 c-15.422,0-29.73,4.747-41.581,12.84c-16.537-34.49-51.699-58.356-92.516-58.356c-56.717,0-102.68,45.978-102.68,102.679 c0,11.917,2.119,23.291,5.863,33.934c-29.489,7.535-51.379,34.046-51.379,65.878c0,37.677,30.556,68.219,68.219,68.219h273.18 c37.678,0,68.219-30.542,68.219-68.219C485.34,326.516,461.475,298.892,429.945,292.87z"></path> </g> </g></svg></div>`;
                }
                case "4": {
                  currSky.innerHTML = `<div class="currSky-result result-cloudy"><span>흐려흐려</span><svg fill="#000000" viewBox="0 0 24 24" id="cloudy" data-name="Flat Color" xmlns="http://www.w3.org/2000/svg" class="icon flat-color"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path id="primary" d="M17,6l-.52,0A6,6,0,0,0,6.35,8,4,4,0,1,0,6,16H17A5,5,0,0,0,17,6Z" style="fill: #000000;"></path><path id="secondary" d="M18,12h0a5,5,0,0,0-8,0h0a4,4,0,0,0,0,8h8a4,4,0,0,0,0-8Z" style="fill: #2ca9bc;"></path></g></svg></div>`;
                }
              }
            }

            function ShowWeatherVal() {
              const cate = parseData.response.body.items.item[0].category;
              let reh = parseData.response.body.items.item[10].fcstValue; // 습도
              let pop = parseData.response.body.items.item[7].fcstValue; // 강수확률
              let wsd = parseData.response.body.items.item[4].fcstValue; // 풍속
              let sno = parseData.response.body.items.item[11].fcstValue; // 적설

              switch (cate) {
                case "TMP": {
                  // 현재 온도
                  currTmp.innerHTML =
                    parseData.response.body.items.item[0].fcstValue;
                }
                case "REH": {
                  //현재 습도
                  currREH.innerHTML = reh;
                }
                case "TMN": {
                  // 금일 최저기온
                }
                case "TMX": {
                  // 금일 최고기온
                }
                case "SNO": {
                  // 적설
                  function replaceWord() {
                    if (typeof sno === "number") {
                      console.log("num");
                    } else {
                      console.log(sno);
                      currSno.innerText = sno.replace("cm", "");
                    }
                  }

                  replaceWord();
                }
                case "WSD": {
                  //  풍속
                  currWsd.innerHTML = wsd;
                }
                case "POP": {
                  // 강수확률
                  currPop.innerHTML = pop;
                }
              }
            }

            ShowWeatherVal();
            ChkSky();

            resolve("resolve");
          }
        };
        xhr.send();
      }, 1000);
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

// let result = await promise; // 프라미스가 이행될 때까지 기다림 (*)

window.onload = currLocationVal();
