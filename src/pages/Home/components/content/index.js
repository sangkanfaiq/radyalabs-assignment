import React, { useEffect, useState } from "react";
import "./styles.scss";
import { IoMdGlobe } from "react-icons/io";
import { BiCaretDown } from "react-icons/bi";
import { AiFillPlayCircle } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { IoIosWater } from "react-icons/io";
import { SiWindicss } from "react-icons/si";
import { GiHeavyRain } from "react-icons/gi";
import { BsFillSunFill, BsSunriseFill, BsSunsetFill } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import axios from "axios";
import moment from 'moment'

const API_GMAPS = process.env.REACT_APP_APIGOOGLE

const Content = () => {
  const [forecast, setForecast] = useState({
    current: [],
    daily: []
  });

  const [weatherDetails, setWeatherDetails] = useState(false)

  const [ status, setStatus ] = useState('')
  const [ coord, setCoord ] = useState({
    lat: 0,
    location: '',
    long: 0
  })
  console.log(status)

  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
    } else {
      setStatus("Locating...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStatus(null);
          axios({
            method: 'GET',
            url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&sensor=true&key=${API_GMAPS}`
          })
          .then(res=>{
            setCoord({
              lat: position.coords.latitude,
              location: res.data.results[10].formatted_address,
              long: position.coords.longitude,
            });
          }).catch(err=>{
            console.log(err.response)
          })
        },
        () => {
          setStatus("Unable to retrieve your location");
        }
      );
    }
  };

  const getWeather = async () => {
    await axios({
      method: "GET",
      url: `https://api.openweathermap.org/data/3.0/onecall?lat=-6.824096&lon=107.1374006&exclude=hourly&unit=emperial&appid=${process.env.REACT_APP_API_KEY}`,
    })
      .then((res) => {
        setForecast(res.data)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(()=> {
    getLocation()
    getWeather()
  }, [coord.lat, coord.long])


  const newDate = (number)=> {
    let new_date = moment().add(number, 'days').format("ddd DD")
    return new_date
  }

  return (
    <div className="content">
      <div className="header">
        <div className="left">
          <div className="logo">
            The Weather Channel
            <img src="/assets/weather.png" alt="logo" title="Logo" />
          </div>
          <h5>An IBM Business</h5>
        </div>

        <div className="center">
          <div className="search-bar">
            <input type="text" placeholder="Select your location"/>
            <BiSearch className="search-icon" />
          </div>
        </div>

        <div className="right">
          <IoMdGlobe className="right-icon" />
          <p>ID</p>
          <div className="v-line"></div>
          <p>° C</p>
          <BiCaretDown className="right-icon-down" />
        </div>
      </div>
      
      <div className="sub-header">
        <img src="/assets/weather2.png" alt="logo" />
        <p>{Math.ceil(forecast.current?.temp-273.15)}° {coord.location}</p>
        <div className="v-line"></div>
      </div>

      <nav className="nav">
        <div className="navmenu">
          <div className="navlinks active">Today</div>
          <div className="navlinks">Hourly</div>
          <div className="navlinks">10 Day</div>
          <div className="navlinks">Weekend</div>
          <div className="navlinks">Monthly</div>
          <div className="navlinks">Radar</div>
          <div className="navlinks">
            <AiFillPlayCircle className="play-icon" />
            Video
          </div>
          <div className="navlinks">
            More Forecast
            <BiCaretDown />
          </div>
        </div>
      </nav>

      <div className="weather">
        <div className="row weather-section">
          <div className="col-md-8 weather-left">
            <div className="summary">
              <div className="details">
                <h3>{coord.location}</h3>
                <p>as of {moment().format('LT')}</p>
                <h1>{Math.ceil(forecast.current?.temp-273.15)}°</h1>
                <h2>{forecast.daily[0]?.weather[0]?.main}</h2>
                <h4>{forecast.daily[0]?.rain}% chance of rain through 5 pm</h4>
              </div>

              <div className="wheather-status">
                <img src={`https://openweathermap.org/img/w/${forecast?.daily[0]?.weather[0]?.icon}.png`} alt="logo"/>
                <h1>{Math.ceil(forecast.daily[0]?.temp.min-273.15)}°/{Math.ceil(forecast.daily[0]?.temp.max-273.15)}°</h1>
              </div>
            </div>

            <div className="weather-info">
              <div className="title-top d-flex justify-content-between">
                <h5>Today's Forecast for {coord.location}</h5>
                <FiChevronDown style={{color: 'blue', fontSize: '30px,', margin: '1em', cursor: 'pointer'}} onClick={()=> setWeatherDetails(!weatherDetails)}/>
              </div>
              <div className="sum-info">
                <div className="sum-info-details">
                  <h4>Morning</h4>
                  <h3>{Math.ceil(forecast.daily[0]?.temp.morn-273.15)}°</h3>
                  <img src={`https://openweathermap.org/img/w/${forecast.daily[0]?.weather[0]?.icon}.png`} alt="logo" />
                  <h5><GiHeavyRain className="icon" />{Math.ceil(forecast.daily[0]?.rain)}%</h5>
                </div>

                <div className="vertical-line"></div>

                <div className="sum-info-details">
                  <h4>Afternoon</h4>
                  <h3>{Math.ceil(forecast.daily[0]?.temp.day-273.15)}°</h3>
                  <img src={`https://openweathermap.org/img/w/${forecast.daily[0]?.weather[0]?.icon}.png`} alt="logo" />
                  <h5><GiHeavyRain className="icon" />{Math.ceil(forecast.daily[0]?.rain)}%</h5>
                </div>

                <div className="vertical-line"></div>

                <div className="sum-info-details">
                  <h4>Evening</h4>
                  <h3>{Math.ceil(forecast.daily[0]?.temp.eve-273.15)}°</h3>
                  <img src={`https://openweathermap.org/img/w/${forecast.daily[0]?.weather[0]?.icon}.png`} alt="logo" />
                  <h5><GiHeavyRain className="icon" />{Math.ceil(forecast.daily[0]?.rain)}%</h5>
                </div>

                <div className="vertical-line"></div>

                <div className="sum-info-details">
                  <h4>Overnight</h4>
                  <h3>{Math.ceil(forecast.daily[0]?.temp.night-273.15)}°</h3>
                  <img src={`https://openweathermap.org/img/w/${forecast.daily[0]?.weather[0]?.icon}.png`} alt="logo" />
                  <h5><GiHeavyRain className="icon" />{Math.ceil(forecast.daily[0]?.rain)}%</h5>
                </div>
              </div>

              <div className={weatherDetails ? "weather-details active" : "weather-details"}>
                <div className="weather-title">
                  <h3>
                    Today's Weather<span> - {coord.location}</span>
                  </h3>
                  <p>as of {moment().format('LT')}</p>
                </div>

                <div className="details">
                  <div className="row d-flex justify-content-between">
                    <div className="col-md-6 weather-desc">
                      <h5>
                        {moment().format('ddd DD')} | <span>Day</span>
                      </h5>
                      <div className="w-left-desc">
                        <div className="left-desc-comp">
                          <h1>{Math.ceil(forecast.current.temp-273.15)}°</h1>
                          <img src={`https://openweathermap.org/img/w/${forecast.daily[0]?.weather[0]?.icon}.png`} alt="logo" />
                        </div>
                        <div className="right-desc-comp">
                          <div className="weather-desc-comp">
                            <GiHeavyRain className="icon" />
                            <p>{forecast.daily[0]?.rain ? `${Math.ceil(forecast.daily[0].rain)}` : `0`}%</p>
                          </div>
                          <div className="weather-desc-comp">
                            <SiWindicss className="icon" />
                            <p>N {forecast.daily[0]?.wind_speed ? `${forecast.daily[0]?.wind_speed}` : `0`} mph</p>
                          </div>
                        </div>
                      </div>
                      <p>
                        {forecast.daily[0]?.weather[0]?.main} with a slight chance of {forecast.daily[0]?.weather[0]?.description}. High {Math.ceil(forecast.daily[0]?.temp.max-273.15)}C, Winds N at {Math.ceil(forecast.daily[0]?.wind_speed)} to {Math.ceil(forecast.daily[0]?.wind_gust)} mph. Chance of rain {Math.ceil(forecast.daily[0]?.rain)}%
                      </p>

                      <div className="w-card">
                        <div className="w-box">
                          <div className="w-panel d-flex">
                            <IoIosWater className="icon" />
                            <div className="panel-details">
                              <h3>Humidity</h3>
                              <h4>{forecast.current.humidity}%</h4>
                            </div>
                          </div>

                          <div className="w-panel d-flex">
                            <BsSunriseFill className="icon" />
                            <div className="panel-details">
                              <h3>Sunrise</h3>
                              <h4>{moment(forecast.current.sunrise).format('LT')}</h4>
                            </div>
                          </div>
                        </div>
                        <div className="w-box">
                          <div className="w-panel d-flex">
                            <BsFillSunFill className="icon" />
                            <div className="panel-details">
                              <h3>UV Index</h3>
                              <h4>{forecast.current.uvi}%</h4>
                            </div>
                          </div>

                          <div className="w-panel d-flex">
                            <BsSunsetFill className="icon" />
                            <div className="panel-details">
                              <h3>Sunset</h3>
                              <h4>{moment(forecast.current.sunset).format('LT')}</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 weather-desc">
                      <h5>
                        {newDate(1)} | <span>Day</span>
                      </h5>
                      <div className="w-left-desc">
                        <div className="left-desc-comp">
                          <h1>{Math.ceil((forecast.daily[0]?.temp.min - 273.15))}°</h1>
                          <img src={`https://openweathermap.org/img/w/${forecast.daily[0]?.weather[0]?.icon}.png`} alt="logo" />
                        </div>
                        <div className="right-desc-comp">
                          <div className="weather-desc-comp">
                            <GiHeavyRain className="icon" />
                            <p>{forecast.daily[0]?.rain ? `${Math.ceil(forecast.daily[0]?.rain)}` : `0`}%</p>
                          </div>
                          <div className="weather-desc-comp">
                            <SiWindicss className="icon" />
                            <p>N {forecast.daily[0]?.wind_gust ? `${Math.ceil(forecast.daily[0]?.wind_gust)}` : `0`} mph</p>
                          </div>
                        </div>
                      </div>
                      <p>
                        {forecast.daily[0]?.weather[0]?.main} with a slight chance of {forecast.daily[0]?.weather[0]?.description}. High {Math.ceil(forecast.daily[0]?.temp.max-273.15)}C, Winds N at {Math.ceil(forecast.daily[0]?.wind_speed)} to {Math.ceil(forecast.daily[0]?.wind_gust)} mph. Chance of rain {Math.ceil(forecast.daily[0]?.rain)}%
                      </p>

                      <div className="w-card">
                        <div className="w-box">
                          <div className="w-panel d-flex">
                            <IoIosWater className="icon" />
                            <div className="panel-details">
                              <h3>Humidity</h3>
                              <h4>{forecast.daily[0]?.humidity}%</h4>
                            </div>
                          </div>

                          <div className="w-panel d-flex">
                            <BsSunriseFill className="icon" />
                            <div className="panel-details">
                              <h3>Sunrise</h3>
                              <h4>{moment(forecast.daily[0]?.sunrise).format('LT')}</h4>
                            </div>
                          </div>
                        </div>
                        <div className="w-box">
                          <div className="w-panel d-flex">
                            <BsFillSunFill className="icon" />
                            <div className="panel-details">
                              <h3>UV Index</h3>
                              <h4>{Math.ceil(forecast.daily[0]?.uvi)}%</h4>
                            </div>
                          </div>

                          <div className="w-panel d-flex">
                            <BsSunsetFill className="icon" />
                            <div className="panel-details">
                              <h3>Sunset</h3>
                              <h4>{moment(forecast.daily[0]?.sunset).format('LT')}</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="forecast">
                  <div className="forecast-details d-flex justify-content-between">
                    <div className="forecast-info d-flex">
                      <p>{moment().format('ddd DD')}</p>
                      <h4>
                        {Math.ceil(forecast.daily[0]?.temp.max-273.15)}°<span>/{Math.ceil(forecast.daily[0]?.temp.min-273.15)}°</span>
                      </h4>
                    </div>
                    <div className="forecast-img d-flex">
                      <img src={`https://openweathermap.org/img/w/${forecast.daily[0]?.weather[0]?.icon}.png`} alt="logo" />
                      {moment().format('A')} {forecast.daily[0]?.weather[0]?.description}
                    </div>
                    <div className="forecast-status d-flex justify-content-between">
                      <div className="rainy">
                        <GiHeavyRain className="icon" />
                        {Math.ceil(forecast.daily[0]?.rain)}%
                      </div>
                      <div className="wind">
                        <SiWindicss className="icon" />
                        N {Math.ceil(forecast.current.wind_speed)} mph
                      </div>
                      <div className="dropdown">
                        <FiChevronDown className="icon" />
                      </div>
                    </div>
                  </div>
                  <div className="forecast-details d-flex justify-content-between">
                    <div className="forecast-info d-flex">
                      <p>{newDate(1)}</p>
                      <h4>
                        {Math.ceil(forecast.daily[1]?.temp.max-273.15)}°<span>/{Math.ceil(forecast.daily[1]?.temp.min-273.15)}°</span>
                      </h4>
                    </div>
                    <div className="forecast-img d-flex">
                      <img src={`https://openweathermap.org/img/w/${forecast.daily[1]?.weather[0]?.icon}.png`} alt="logo" />
                      {moment().format('A')} {forecast.daily[1]?.weather[0]?.description}
                    </div>
                    <div className="forecast-status d-flex justify-content-between">
                      <div className="rainy">
                        <GiHeavyRain className="icon" />
                        {Math.ceil(forecast.daily[1]?.rain)}%
                      </div>
                      <div className="wind">
                        <SiWindicss className="icon" />
                        {forecast.daily[1]?.wind_speed ? `N ${Math.ceil(forecast.daily[1]?.wind_speed)}` : `0`} mph
                      </div>
                      <div className="dropdown">
                        <FiChevronDown className="icon" />
                      </div>
                    </div>
                  </div>
                  <div className="forecast-details d-flex justify-content-between">
                    <div className="forecast-info d-flex">
                      <p>{newDate(2)}</p>
                      <h4>
                        {Math.ceil(forecast.daily[2]?.temp.max-273.15)}°<span>/{Math.ceil(forecast.daily[2]?.temp.min-273.15)}</span>
                      </h4>
                    </div>
                    <div className="forecast-img d-flex">
                      <img src={`https://openweathermap.org/img/w/${forecast.daily[2]?.weather[0]?.icon}.png`} alt="logo" />
                      {moment().format('A')} {forecast.daily[2]?.weather[0]?.description}
                    </div>
                    <div className="forecast-status d-flex justify-content-between">
                      <div className="rainy">
                        <GiHeavyRain className="icon" />
                        {Math.ceil(forecast.daily[2]?.rain)}%
                      </div>
                      <div className="wind">
                        <SiWindicss className="icon" />
                        N {Math.ceil(forecast.daily[2]?.wind_speed)} mph
                      </div>
                      <div className="dropdown">
                        <FiChevronDown className="icon" />
                      </div>
                    </div>
                  </div>
                  <div className="forecast-details d-flex justify-content-between">
                    <div className="forecast-info d-flex">
                      <p>{newDate(3)}</p>
                      <h4>
                        {Math.ceil(forecast.daily[3]?.temp.max-273.15)}°<span>/{Math.ceil(forecast.daily[3]?.temp.min-273.15)}°</span>
                      </h4>
                    </div>
                    <div className="forecast-img d-flex">
                      <img src={`https://openweathermap.org/img/w/${forecast.daily[3]?.weather[0]?.icon}.png`} alt="logo" />
                      {moment().format('A')} {forecast.daily[3]?.weather[0].description}
                    </div>
                    <div className="forecast-status d-flex justify-content-between">
                      <div className="rainy">
                        <GiHeavyRain className="icon" />
                        {Math.ceil(forecast.daily[3]?.rain)}%
                      </div>
                      <div className="wind">
                        <SiWindicss className="icon" />
                        N {Math.ceil(forecast.daily[3]?.wind_speed)} mph
                      </div>
                      <div className="dropdown">
                        <FiChevronDown className="icon" />
                      </div>
                    </div>
                  </div>
                  <div className="forecast-details d-flex justify-content-between">
                    <div className="forecast-info d-flex">
                      <p>{newDate(4)}</p>
                      <h4>
                        {Math.ceil(forecast.daily[4]?.temp.max-273.15)}°<span>/{Math.ceil(forecast.daily[4]?.temp.min-273.15)}°</span>
                      </h4>
                    </div>
                    <div className="forecast-img d-flex">
                      <img src={`https://openweathermap.org/img/w/${forecast.daily[4]?.weather[0]?.icon}.png`} alt="logo" />
                      {moment().format('A')} {forecast.daily[4]?.weather[0]?.description}
                    </div>
                    <div className="forecast-status d-flex justify-content-between">
                      <div className="rainy">
                        <GiHeavyRain className="icon" />
                        {Math.ceil(forecast.daily[4]?.rain)}%
                      </div>
                      <div className="wind">
                        <SiWindicss className="icon" />
                        N {Math.ceil(forecast.daily[4]?.wind_speed)} mph
                      </div>
                      <div className="dropdown">
                        <FiChevronDown className="icon" />
                      </div>
                    </div>
                  </div>
                  <div className="forecast-details d-flex justify-content-between">
                    <div className="forecast-info d-flex">
                      <p>{newDate(5)}</p>
                      <h4>
                        {Math.ceil(forecast.daily[5]?.temp.max-273.15)}°<span>/{Math.ceil(forecast.daily[5]?.temp.min-273.15)}°</span>
                      </h4>
                    </div>
                    <div className="forecast-img d-flex">
                      <img src={`https://openweathermap.org/img/w/${forecast.daily[5]?.weather[0]?.icon}.png`} alt="logo" />
                      {moment().format('A')} {forecast.daily[5]?.weather[0]?.description}
                    </div>
                    <div className="forecast-status d-flex justify-content-between">
                      <div className="rainy">
                        <GiHeavyRain className="icon" />
                        {Math.ceil(forecast.daily[5]?.rain)}%
                      </div>
                      <div className="wind">
                        <SiWindicss className="icon" />
                        N {Math.ceil(forecast.daily[5]?.wind_speed)} mph
                      </div>
                      <div className="dropdown">
                        <FiChevronDown className="icon" />
                      </div>
                    </div>
                  </div>
                  <div className="forecast-details d-flex justify-content-between">
                    <div className="forecast-info d-flex">
                      <p>{newDate(6)}</p>
                      <h4>
                        {Math.ceil(forecast.daily[6]?.temp.max-273.15)}°<span>/{Math.ceil(forecast.daily[6]?.temp.min-273.15)}°</span>
                      </h4>
                    </div>
                    <div className="forecast-img d-flex">
                      <img src={`https://openweathermap.org/img/w/${forecast.daily[6]?.weather[0]?.icon}.png`} alt="logo" />
                      {moment().format('A')} {forecast.daily[6]?.weather[0]?.description}
                    </div>
                    <div className="forecast-status d-flex justify-content-between">
                      <div className="rainy">
                        <GiHeavyRain className="icon" />
                        {Math.ceil(forecast.daily[6]?.rain)}%
                      </div>
                      <div className="wind">
                        <SiWindicss className="icon" />
                        N {Math.ceil(forecast.daily[6]?.wind_speed)} mph
                      </div>
                      <div className="dropdown">
                        <FiChevronDown className="icon" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="button-next">
                <button>Next hours</button>
              </div>
            </div>
          </div>
          <div className="col-md-4 weather-right"></div>
        </div>
      </div>
    </div>
  );
};

export default Content;
