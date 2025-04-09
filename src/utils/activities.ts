import { Activity } from "@/types/weather";
import {
  FaUmbrellaBeach,
  FaHiking,
  FaSnowflake,
  FaCoffee,
  FaSwimmingPool,
  FaBiking,
  FaBook,
  FaFilm,
  FaGamepad,
  FaPaintBrush,
  FaUtensils,
  FaDumbbell,
} from "react-icons/fa";

export const activities: Activity[] = [
  {
    title: "Beach Day",
    description: "Perfect weather for a day at the beach!",
    icon: "FaUmbrellaBeach",
    weatherConditions: ["Clear", "Sunny", "Partly cloudy"],
  },
  {
    title: "Hiking",
    description: "Great conditions for a scenic hike.",
    icon: "FaHiking",
    weatherConditions: ["Clear", "Partly cloudy", "Clouds"],
  },
  {
    title: "Winter Sports",
    description: "Time for some snow activities!",
    icon: "FaSnowflake",
    weatherConditions: ["Snow", "Rain and snow"],
  },
  {
    title: "Café Visit",
    description: "Perfect weather to enjoy a warm drink indoors.",
    icon: "FaCoffee",
    weatherConditions: ["Rain", "Drizzle", "Thunderstorm", "Fog"],
  },
  {
    title: "Swimming",
    description: "Take a refreshing dip in the pool!",
    icon: "FaSwimmingPool",
    weatherConditions: ["Clear", "Sunny", "Partly cloudy"],
  },
  {
    title: "Bike Ride",
    description: "Enjoy a pleasant bike ride around town.",
    icon: "FaBiking",
    weatherConditions: ["Clear", "Partly cloudy", "Clouds"],
  },
  {
    title: "Reading Time",
    description: "Perfect weather to curl up with a good book.",
    icon: "FaBook",
    weatherConditions: ["Rain", "Drizzle", "Thunderstorm", "Fog", "Snow"],
  },
  {
    title: "Movie Marathon",
    description: "Great day for a movie marathon at home.",
    icon: "FaFilm",
    weatherConditions: ["Rain", "Drizzle", "Thunderstorm", "Fog", "Snow"],
  },
  {
    title: "Gaming Session",
    description: "Perfect weather for some indoor gaming.",
    icon: "FaGamepad",
    weatherConditions: ["Rain", "Drizzle", "Thunderstorm", "Fog", "Snow"],
  },
  {
    title: "Art & Crafts",
    description: "Get creative with some indoor art projects.",
    icon: "FaPaintBrush",
    weatherConditions: ["Rain", "Drizzle", "Thunderstorm", "Fog", "Snow"],
  },
  {
    title: "Cooking Class",
    description: "Try out some new recipes in the kitchen.",
    icon: "FaUtensils",
    weatherConditions: ["Rain", "Drizzle", "Thunderstorm", "Fog", "Snow"],
  },
  {
    title: "Home Workout",
    description: "Stay active with an indoor workout session.",
    icon: "FaDumbbell",
    weatherConditions: ["Rain", "Drizzle", "Thunderstorm", "Fog", "Snow"],
  },
];

export const getWeatherIcon = (icon: string) => {
  switch (icon) {
    case "FaUmbrellaBeach":
      return FaUmbrellaBeach;
    case "FaHiking":
      return FaHiking;
    case "FaSnowflake":
      return FaSnowflake;
    case "FaCoffee":
      return FaCoffee;
    case "FaSwimmingPool":
      return FaSwimmingPool;
    case "FaBiking":
      return FaBiking;
    case "FaBook":
      return FaBook;
    case "FaFilm":
      return FaFilm;
    case "FaGamepad":
      return FaGamepad;
    case "FaPaintBrush":
      return FaPaintBrush;
    case "FaUtensils":
      return FaUtensils;
    case "FaDumbbell":
      return FaDumbbell;
    default:
      return FaCoffee;
  }
};
