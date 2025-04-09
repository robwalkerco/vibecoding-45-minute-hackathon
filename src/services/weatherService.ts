import axios from "axios";
import { WeatherData } from "@/types/weather";

const BASE_URL = "https://api.open-meteo.com/v1";

export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    // First, get the coordinates for the city
    const geocodingResponse = await axios.get(
      "https://geocoding-api.open-meteo.com/v1/search",
      {
        params: {
          name: city,
          count: 1,
          format: "json",
        },
      }
    );

    if (
      !geocodingResponse.data.results ||
      geocodingResponse.data.results.length === 0
    ) {
      throw new Error(
        "City not found. Please check the city name and try again."
      );
    }

    const { latitude, longitude, name } = geocodingResponse.data.results[0];

    // Then, get the weather data for those coordinates
    const weatherResponse = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        latitude,
        longitude,
        current: "temperature_2m,relative_humidity_2m,weather_code",
        timezone: "auto",
      },
    });

    // Map Open-Meteo response to our WeatherData interface
    return {
      main: {
        temp: weatherResponse.data.current.temperature_2m,
        feels_like: weatherResponse.data.current.temperature_2m, // Open-Meteo doesn't provide feels_like
        humidity: weatherResponse.data.current.relative_humidity_2m,
      },
      weather: [
        {
          id: weatherResponse.data.current.weather_code,
          main: getWeatherMain(weatherResponse.data.current.weather_code),
          description: getWeatherDescription(
            weatherResponse.data.current.weather_code
          ),
          icon: getWeatherIconCode(weatherResponse.data.current.weather_code),
        },
      ],
      name,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
    throw error;
  }
};

// Helper functions to convert Open-Meteo weather codes to our format
const getWeatherMain = (code: number): string => {
  if (code === 0) return "Clear";
  if (code <= 3) return "Clouds";
  if (code <= 48) return "Fog";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
};

const getWeatherDescription = (code: number): string => {
  const descriptions: { [key: number]: string } = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return descriptions[code] || "Unknown";
};

const getWeatherIconCode = (code: number): string => {
  const iconMap: { [key: number]: string } = {
    0: "clear", // Clear sky
    1: "partly-cloudy", // Mainly clear
    2: "partly-cloudy", // Partly cloudy
    3: "cloudy", // Overcast
    45: "fog", // Fog
    48: "fog", // Depositing rime fog
    51: "drizzle", // Light drizzle
    53: "drizzle", // Moderate drizzle
    55: "drizzle", // Dense drizzle
    61: "rain", // Slight rain
    63: "rain", // Moderate rain
    65: "rain", // Heavy rain
    71: "snow", // Slight snow
    73: "snow", // Moderate snow
    75: "snow", // Heavy snow
    77: "snow", // Snow grains
    80: "rain", // Slight rain showers
    81: "rain", // Moderate rain showers
    82: "rain", // Violent rain showers
    85: "snow", // Slight snow showers
    86: "snow", // Heavy snow showers
    95: "thunderstorm", // Thunderstorm
    96: "thunderstorm", // Thunderstorm with slight hail
    99: "thunderstorm", // Thunderstorm with heavy hail
  };
  return iconMap[code] || "clear";
};
