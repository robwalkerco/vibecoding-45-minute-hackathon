"use client";

import { useState, useEffect } from "react";
import { getWeatherByCity } from "@/services/weatherService";
import { suggestCity } from "@/services/openAIService";
import { WeatherData } from "@/types/weather";
import { activities, getWeatherIcon } from "@/utils/activities";
import { FaSearch, FaTimes, FaSpinner } from "react-icons/fa";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from "react-icons/wi";

const getWeatherIconComponent = (icon: string) => {
  switch (icon) {
    case "clear":
      return WiDaySunny;
    case "partly-cloudy":
    case "cloudy":
      return WiCloudy;
    case "rain":
    case "drizzle":
      return WiRain;
    case "snow":
      return WiSnow;
    case "thunderstorm":
      return WiThunderstorm;
    case "fog":
      return WiFog;
    default:
      return WiDaySunny;
  }
};

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [suggesting, setSuggesting] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem("weatherSearchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city) return;

    setLoading(true);
    setError("");

    try {
      const data = await getWeatherByCity(city);
      setWeather(data);
      if (!searchHistory.includes(city)) {
        setSearchHistory((prev) => [city, ...prev].slice(0, 10));
      }
    } catch {
      // Try to get a city suggestion without showing error
      setSuggesting(true);
      try {
        const suggestion = await suggestCity(city);
        if (suggestion) {
          // Automatically use the suggested city
          setCity(suggestion);
          try {
            const suggestedData = await getWeatherByCity(suggestion);
            setWeather(suggestedData);
            if (!searchHistory.includes(suggestion)) {
              setSearchHistory((prev) => [suggestion, ...prev].slice(0, 10));
            }
          } catch (suggestedError) {
            console.error(
              "Error getting weather for suggested city:",
              suggestedError
            );
          }
        }
      } catch (suggestionError) {
        console.error("Error getting city suggestion:", suggestionError);
      } finally {
        setSuggesting(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromHistory = (cityToRemove: string) => {
    setSearchHistory((prev) => prev.filter((city) => city !== cityToRemove));
  };

  const handleHistoryItemClick = async (cityFromHistory: string) => {
    setCity(cityFromHistory);
    setLoading(true);
    setError("");

    try {
      const data = await getWeatherByCity(cityFromHistory);
      setWeather(data);
      if (!searchHistory.includes(cityFromHistory)) {
        setSearchHistory((prev) => [cityFromHistory, ...prev].slice(0, 10));
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getSuggestedActivities = () => {
    if (!weather) return [];
    const currentWeather = weather.weather[0].main;
    return activities.filter((activity) =>
      activity.weatherConditions.includes(currentWeather)
    );
  };

  const openGoogleMaps = (activity: string) => {
    if (!weather) return;
    const searchQuery = `${activity} in ${weather.name}`;
    const encodedQuery = encodeURIComponent(searchQuery);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`,
      "_blank"
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">
          Weather Activity Finder
        </h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
              className="flex-1 p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            />
            <button
              type="submit"
              disabled={loading || suggesting}
              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 flex items-center gap-2"
            >
              {loading || suggesting ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaSearch />
              )}
              {loading
                ? "Loading..."
                : suggesting
                ? "Finding city..."
                : "Search"}
            </button>
          </div>
        </form>

        {searchHistory.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              Recent Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((cityName, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm"
                >
                  <button
                    onClick={() => handleHistoryItemClick(cityName)}
                    className="text-gray-900 hover:text-blue-500"
                  >
                    {cityName}
                  </button>
                  <button
                    onClick={() => handleRemoveFromHistory(cityName)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {weather && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Weather in {weather.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-4">
                  {(() => {
                    const Icon = getWeatherIconComponent(
                      weather.weather[0].icon
                    );
                    return <Icon className="text-6xl text-blue-500" />;
                  })()}
                  <div>
                    <p className="text-4xl font-bold mb-2 text-gray-900">
                      {Math.round(weather.main.temp)}°C
                    </p>
                    <p className="text-gray-800">
                      Feels like: {Math.round(weather.main.feels_like)}°C
                    </p>
                    <p className="text-gray-800">
                      Humidity: {weather.main.humidity}%
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xl capitalize text-gray-800">
                  {weather.weather[0].description}
                </p>
              </div>
            </div>
          </div>
        )}

        {weather && (
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-blue-800">
              Suggested Activities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getSuggestedActivities().map((activity, index) => {
                const Icon = getWeatherIcon(activity.icon);
                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => openGoogleMaps(activity.title)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="text-blue-500 text-2xl" />
                      <h4 className="font-semibold text-gray-900">
                        {activity.title}
                      </h4>
                    </div>
                    <p className="text-gray-900">{activity.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
