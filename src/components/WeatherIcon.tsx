import React from 'react';
import {
  Sun,
  SunDim,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  Snowflake,
  CloudLightning,
  Umbrella,
  Wind,
  Shirt,
  Sparkles,
  Compass,
  Footprints,
  Utensils,
  Camera,
  Bike,
  Trees,
  SunMedium,
  CloudHail,
  MoonStar,
  Zap,
} from 'lucide-react';

interface WeatherIconProps {
  name: string;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, className = 'w-6 h-6' }) => {
  switch (name) {
    case 'Sun':
      return <Sun className={className} />;
    case 'SunDim':
      return <SunDim className={className} />;
    case 'SunMedium':
      return <SunMedium className={className} />;
    case 'Moon':
      return <Moon className={className} />;
    case 'MoonStar':
      return <MoonStar className={className} />;
    case 'CloudSun':
      return <CloudSun className={className} />;
    case 'CloudMoon':
      return <CloudMoon className={className} />;
    case 'Cloud':
      return <Cloud className={className} />;
    case 'CloudFog':
      return <CloudFog className={className} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={className} />;
    case 'CloudRain':
    case 'CloudRainWind':
      return <CloudRain className={className} />;
    case 'CloudHail':
      return <CloudHail className={className} />;
    case 'CloudSnow':
      return <CloudSnow className={className} />;
    case 'Snowflake':
      return <Snowflake className={className} />;
    case 'CloudLightning':
      return <CloudLightning className={className} />;
    case 'Umbrella':
      return <Umbrella className={className} />;
    case 'Wind':
      return <Wind className={className} />;
    case 'Shirt':
    case 'Jacket':
      return <Shirt className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'Footprints':
      return <Footprints className={className} />;
    case 'Utensils':
      return <Utensils className={className} />;
    case 'Camera':
      return <Camera className={className} />;
    case 'Bike':
      return <Bike className={className} />;
    case 'Trees':
      return <Trees className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    default:
      return <Sun className={className} />;
  }
};
