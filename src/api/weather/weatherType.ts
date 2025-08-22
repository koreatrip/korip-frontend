export type CurrentWeather = {
  current_date: string;
  temperature: number;
  weather_condition: string;
  temperature_change: string;
  min_temperature: number;
  max_temperature: number;
};

export type TomorrowWeather = {
  tomorrow_date: string;
  min_temperature: number;
  max_temperature: number;
  morning_condition: string;
  morning_precipitation: number;
  afternoon_condition: string;
  afternoon_precipitation: number;
};

export type DetailInfo = {
  feels_like: number;
  humidity: number;
  uv_index: number;
  uv_level: string;
  wind_speed: number;
  sunrise: string;
  sunset: string;
  air_quality_status: string;
};

export type HourlyForecast = {
  time: string;
  weather_condition: string;
  temperature: number;
  precipitation_probability: number;
};

export type AirQuality = {
  pm25_value: number;
  pm25_grade: string;
  pm10_value: number;
  pm10_grade: string;
};

export type TravelTip = {
  tip_message: string;
};

export type WeatherResponse = {
  current_weather: CurrentWeather;
  tomorrow_weather: TomorrowWeather;
  detail_info: DetailInfo;
  hourly_forecast: HourlyForecast[];
  air_quality: AirQuality;
  travel_tip: TravelTip;
  location_name: string;
  latitude: number;
  longitude: number;
  last_updated: string;
};
