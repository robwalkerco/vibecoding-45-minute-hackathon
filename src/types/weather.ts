export interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  name: string;
}

export interface Activity {
  title: string;
  description: string;
  icon: string;
  weatherConditions: string[];
}
