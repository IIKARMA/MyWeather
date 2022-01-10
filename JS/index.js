//------------------------------Server request-----------------------------------------------------
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
}

var lat;
var lng;
function errorFunction() {
  alert("Geocoder failed");
}
function successFunction(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;

  let request, request1, request2, request3, request4;
  if (window.XMLHttpRequest) {
    request = new XMLHttpRequest();
    request1 = new XMLHttpRequest();
    request2 = new XMLHttpRequest();
    request3 = new XMLHttpRequest();
    request4 = new XMLHttpRequest();
  } else {
    request = new ActiveXObject("Microsoft.XMLHTTP");
    request1 = new ActiveXObject("Microsoft.XMLHTTP");
    request2 = new ActiveXObject("Microsoft.XMLHTTP");
    request3 = new ActiveXObject("Microsoft.XMLHTTP");
    request4 = new ActiveXObject("Microsoft.XMLHTTP");
  }
  request.open(
    "get",
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=c0ad4bfc4a051a3118be5d72b82887d0`,
    true
  );
  request.onload = function () {
    if (request.status === 200) {
      let rezult = JSON.parse(request.response);
      createWeather(rezult);
      console.log(rezult);
    }
  };
  request1.open(
    "get",
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&&exclude=daily&APPID=c0ad4bfc4a051a3118be5d72b82887d0`,
    true
  );
  request1.onload = function () {
    if (request1.status === 200) {
      let rezult1 = JSON.parse(request1.response);
      createTableWeathe(rezult1);
    }
  };
  request2.open(
    "get",
    `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lng}&cnt=5&APPID=c0ad4bfc4a051a3118be5d72b82887d0`,
    true
  );
  request2.onload = function () {
    if (request2.status === 200) {
      let rezult = JSON.parse(request2.response);
      aroundCity(rezult);
    }
  };
  request3.open(
    "get",
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&APPID=c0ad4bfc4a051a3118be5d72b82887d0`,
    true
  );
  request3.onload = function () {
    if (request3.status === 200) {
      let rezult = JSON.parse(request3.response);
      table5Day(rezult);
      createWeather5day(rezult);
    }
  };
  request4.open(
    "get",
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&APPID=c0ad4bfc4a051a3118be5d72b82887d0`,
    true
  );
  request4.onload = function () {
    if (request4.status === 200) {
      let rezult = JSON.parse(request4.response);
      createFirtTable(rezult);
    }
  };
  request.send();
  request4.send();
  request3.send();
  request2.send();
  request1.send();
}

//----------------------Create object weather-------------------------------------------
//_________________________________________CURRENT_________________________________________
function createWeather(weather) {
  if (new Date().getMonth() + 1 < 10)
    dateCurrent.innerHTML = `${new Date().getDate()}.0${
      new Date().getMonth() + 1
    }.${new Date().getFullYear()}`;
  else
    dateCurrent.innerHTML = `${new Date().getDate()}.${
      new Date().getMonth() + 1
    }.${new Date().getFullYear()}`;

  descriptionIMG.setAttribute(
    "src",
    "http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png"
  );
  document.querySelector("#descriptionTXT").innerHTML =
    weather.weather[0].description.replace(
      /\w/,
      weather.weather[0].description[0].toUpperCase()
    );
  //-------------------------Set second div----------------------------------------------------

  currentTemp.innerHTML = (weather.main.temp - 273.15).toFixed(0) + "&#176;C";
  realtemp.innerHTML =
    "Real Feel " + (weather.main.feels_like - 273.15).toFixed(0) + " &#176;C";
  //----------------------------Set third div------------------------------------------------------
  document.querySelector(
    ".bodyCurrent div:last-of-type > h2:last-child "
  ).innerHTML = `duration: ${weather.sys.sunset - weather.sys.sunset}`;
  document.querySelector(
    ".bodyCurrent div:last-of-type > h2"
  ).innerHTML = `Sunrice: ${weather.sys.sunrise}`;
  document.querySelector(
    ".bodyCurrent div:last-of-type > h2:nth-child(2) "
  ).innerHTML = `Sunset: ${weather.sys.sunset}`;

  nameCity.setAttribute(
    "placeholder",
    weather.name + "," + weather.sys.country
  );
}

//-________________________________HOURLY________________________________

function createTableWeathe(weather) {
  let tdlIMG = document.querySelectorAll("#tableIMG > td >img"),
    tdForecast = document.querySelectorAll("#forecast >td"),
    tdTemp = document.querySelectorAll("#temp>td"),
    realFeel = document.querySelectorAll("#rFeel>td"),
    windSpeed = document.querySelectorAll("#wind>td");
  for (let i = 0; i < tdlIMG.length; i++) {
    tdlIMG[i + 1].setAttribute(
      "src",
      "http://openweathermap.org/img/w/" +
        weather.hourly[i].weather[0].icon +
        ".png"
    );
    tdForecast[i + 1].innerHTML = weather.hourly[
      i
    ].weather[0].description.replace(
      /\w/,
      weather.hourly[i].weather[0].description[0].toUpperCase()
    );
    tdTemp[i + 1].innerHTML =
      (weather.hourly[i].temp - 273.15).toFixed(0) + " &#176;C";
    realFeel[i + 1].innerHTML =
      (weather.hourly[i].feels_like - 273.15).toFixed(0) + " &#176;C";
    windSpeed[i + 1].innerHTML = weather.hourly[i].wind_speed + "km/h";
  }
}
//_____________________________NEARBY PLACES___________________________________________________________

function aroundCity(weather) {
  let h2 = document.querySelectorAll(".bodyCityAround > div>h2"),
    h3 = document.querySelectorAll(".bodyCityAround > div>h3"),
    img = document.querySelectorAll(".bodyCityAround > div>img");

  for (let i = 0; i < h2.length; i++) {
    h2[i].innerHTML = weather.list[i].name;
    img[i].setAttribute(
      "src",
      "http://openweathermap.org/img/w/" +
        weather.list[i].weather[0].icon +
        ".png"
    );
    h3[i].innerHTML =
      (weather.list[i].main.temp - 273.15).toFixed(0) + "&#176;C";
  }
}

//-________________________________MAIN2_WEATHER_5_DAY________________________________

function showMain2() {
  if (main2.classList.contains("hiddenmain2")) {
    main2.classList.remove("hiddenmain2");
    main.classList.remove("showmain2");
    main2.classList.add("showmain2");
    main.classList.add("hiddenmain2");
    rq();
    rq1();
  }
}
function hiddenMain2() {
  main.classList.remove("hiddenmain2");
  main2.classList.remove("showmain2");
  main.classList.add("showmain2");
  main2.classList.add("hiddenmain2");
}
function createWeather5day(weather) {
  let divs = document.querySelectorAll(".weather5day > div"),
    h2First = document.querySelectorAll(".weather5day > div >h2:first-of-type"),
    h2Date = document.querySelectorAll(".weather5day > div >h2:nth-child(2)"),
    imgWeather = document.querySelectorAll(".weather5day > div >img"),
    h2Temp = document.querySelectorAll(".weather5day > div >h2:nth-child(4)"),
    h2Cloudy = document.querySelectorAll(".weather5day > div >h2:last-of-type");
  let cunt = 0;
  let opts = { weekday: "long" },
    opts2 = { month: "short", day: "numeric" };

  for (let i = 0; i < divs.length; i++) {
    for (let k = 0; k < h2First.length; k++) {
      //ADD Name Day
      let dat = new Date(weather.list[cunt].dt_txt);
      h2First[k].innerHTML = Intl.DateTimeFormat("en-US", opts).format(dat);
      h2Date[k].innerHTML = Intl.DateTimeFormat("en-US", opts2).format(dat);
      h2Date[k].title = weather.list[cunt].dt_txt;
      //ADD Temp
      h2Temp[k].innerHTML =
        (weather.list[cunt].main.temp - 273.15).toFixed(0) + "&#176;C";
      //ADD IMG
      imgWeather[k].setAttribute(
        "src",
        "http://openweathermap.org/img/w/" +
          weather.list[cunt].weather[0].icon +
          ".png"
      );
      //ADD Cloudy
      h2Cloudy[k].innerHTML = weather.list[cunt].weather[0].description.replace(
        /\w/,
        weather.list[cunt].weather[0].description[0].toUpperCase()
      );
      console.log(weather.list[k].dt_txt);
      cunt += 8;
    }
  }
}

function table5Day(weather) {
  let divClick = document.querySelectorAll(".weather5day > div");
  let tdlIMG = document.querySelectorAll("#tableIMG1> td >img"),
    tdForecast = document.querySelectorAll("#forecast1   >td"),
    tdTemp = document.querySelectorAll("#temp1 >td"),
    realFeel = document.querySelectorAll("#rFeel1 > td"),
    windSpeed = document.querySelectorAll("#wind1>td");
  let cunt = 0;

  for (let i = 0; i < divClick.length; i++) {
    divClick[i].onclick = function () {
      let dat = divClick[i].innerHTML.match(/\d{4}-\d{2}-\d{2}/).toString();
      let count = 0,
        index = 1;
      for (let i = 0; i < 40; i++) {
        if (weather.list[i].dt_txt.indexOf(dat) != -1) {
          count = i;

          for (let k = count; k < count + 8; k++) {
            tdTemp[index].innerHTML =
              (weather.list[k].main.temp - 273.15).toFixed(0) + "&#176;C";
            tdlIMG[index].setAttribute(
              "src",
              "http://openweathermap.org/img/w/" +
                weather.list[k].weather[0].icon +
                ".png"
            );
            tdForecast[index].innerHTML = weather.list[
              k
            ].weather[0].description.replace(
              /\w/,
              weather.list[k].weather[0].description[0].toUpperCase()
            );
            realFeel[index].innerHTML =
              (weather.list[k].main.feels_like - 273.15).toFixed(0) + "&#176;C";
            windSpeed[index].innerHTML = weather.list[k].wind.speed + "km/h";

            index++;
          }
          break;
        }
      }
    };
  }
}

function createFirtTable(weather) {
  let tdlIMG = document.querySelectorAll("#tableIMG1> td >img"),
    tdForecast = document.querySelectorAll("#forecast1   >td"),
    tdTemp = document.querySelectorAll("#temp1 >td"),
    realFeel = document.querySelectorAll("#rFeel1 > td"),
    windSpeed = document.querySelectorAll("#wind1>td");

  for (let k = 0; k < tdlIMG.length; k++) {
    tdTemp[k + 1].innerHTML =
      (weather.list[0].main.temp - 273.15).toFixed(0) + "&#176;C";
    tdlIMG[k + 1].setAttribute(
      "src",
      "http://openweathermap.org/img/w/" +
        weather.list[k].weather[0].icon +
        ".png"
    );
    tdForecast[k + 1].innerHTML = weather.list[
      k
    ].weather[0].description.replace(
      /\w/,
      weather.list[k].weather[0].description[0].toUpperCase()
    );
    realFeel[k + 1].innerHTML =
      (weather.list[k].main.feels_like - 273.15).toFixed(0) + "&#176;C";
    windSpeed[k + 1].innerHTML = weather.list[k].wind.speed + "km/h";
  }
}
