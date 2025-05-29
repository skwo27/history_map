import React, { useEffect, useState, useMemo, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { getYear } from "./Earth";

const latLongToVector3 = (lat, lng, radius) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
};

const processGeoJsonCoordinates = (coordinates, radius) => {
  if (coordinates.length > 0 && Array.isArray(coordinates[0]) && Array.isArray(coordinates[0][0])) {
    return coordinates.map(polygon => processGeoJsonCoordinates(polygon, radius));
  }

  if (coordinates.length > 0 && Array.isArray(coordinates[0]) && coordinates[0].length === 2) {
    return coordinates.map(point => {
      const [lng, lat] = point;
      return latLongToVector3(lat, lng, radius);
    });
  }

  return coordinates.map(point => {
    const [lng, lat] = point;
    return latLongToVector3(lat, lng, radius);
  });
};

const processFeature = (feature, radius) => {
  const { geometry, properties } = feature;
  const { type, coordinates } = geometry;

  let lines = [];

  if (type === "Polygon") {
    coordinates.forEach(ring => {
      lines.push(processGeoJsonCoordinates(ring, radius));
    });
  } else if (type === "MultiPolygon") {
    coordinates.forEach(polygon => {
      polygon.forEach(ring => {
        lines.push(processGeoJsonCoordinates(ring, radius));
      });
    });
  } else if (type === "LineString") {
    lines.push(processGeoJsonCoordinates(coordinates, radius));
  } else if (type === "MultiLineString") {
    coordinates.forEach(line => {
      lines.push(processGeoJsonCoordinates(line, radius));
    });
  }

  return {
    lines,
    properties
  };
};

// 국경선
const BorderLine = ({ points, color, lineWidth, opacity }) => {
  return (
    <Line
      points={points}
      color={color}
      lineWidth={lineWidth}
      transparent={opacity < 1}
      opacity={opacity}
    />
  );
};

const CountryBorders = ({ feature, radius, color, lineWidth, opacity, onClick }) => {
  const processedFeature = useMemo(() => {
    return processFeature(feature, radius);
  }, [feature, radius]);

  return (
    <group onClick={(e) => {
      e.stopPropagation();
      if (onClick) onClick(feature.properties);
    }}>
      {processedFeature.lines.map((line, i) => (
        <BorderLine
          key={`line-${i}`}
          points={line}
          color={color}
          lineWidth={lineWidth}
          opacity={opacity}
        />
      ))}
    </group>
  );
};
export const GeoJsonBorders = ({
  geoJsonUrl,
  year = 1900,
  radius = 2,
  color = "white",
  lineWidth = 1,
  opacity = 0.8,
  onCountryClick
}) => {
  const [geoJson, setGeoJson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    fetch(geoJsonUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setGeoJson(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading GeoJSON:", err);
        setError(err);
        setLoading(false);
      });
  }, [geoJsonUrl]);

  if (loading) return null;
  if (error) return null;
  if (!geoJson) return null;

  return (
    <group>
      {geoJson.features.map((feature, index) => {
        let borderOpacity = opacity;
        let borderWidth = lineWidth;

        if (feature.properties.BORDERPRECISION === 1) {
          borderOpacity = opacity * 0.7; // 대략적인 국경은 더 투명하게
          borderWidth = lineWidth * 0.8;
        } else if (feature.properties.BORDERPRECISION === 3) {
          borderWidth = lineWidth * 1.2; // 정확한 국경은 더 굵게
        }

        return (
          <CountryBorders
            key={`country-${index}`}
            feature={feature}
            radius={radius}
            color={color}
            lineWidth={borderWidth}
            opacity={borderOpacity}
            onClick={onCountryClick}
          />
        );
      })}
    </group>
  );
};

export const YearlyBorders = ({
  baseUrl = "/data",
  year = 1900,
  radius = 2,
  color = "white",
  lineWidth = 1,
  opacity = 0.8,
  onCountryClick
}) => {

  //년도 추가시 수정
  const availableYears = getYear();

  const closestYear = useMemo(() => {
    if (availableYears.includes(year)) return year;

    const previousYears = availableYears.filter(y => y <= year);
    if (previousYears.length > 0) return Math.max(...previousYears);

    return Math.min(...availableYears);
  }, [year]);

  const geoJsonUrl = `${baseUrl}/world_${closestYear}.geojson`;

  return (
    <GeoJsonBorders
      geoJsonUrl={geoJsonUrl}
      radius={radius}
      color={color}
      lineWidth={lineWidth}
      opacity={opacity}
      onCountryClick={onCountryClick}
    />
  );
};

export default YearlyBorders;
