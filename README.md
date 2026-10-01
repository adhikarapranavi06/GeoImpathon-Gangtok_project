# GeoImpathon-Gangtok Project

## Overview

GeoImpathon-Gangtok is a geospatial disaster risk analysis and emergency decision-support system developed for Gangtok, Sikkim. The project integrates multiple environmental and disaster-related indicators using Google Earth Engine to identify areas with different levels of disaster risk and support emergency response planning.

## Problem Statement

Disasters such as floods and landslides can affect settlements, roads and critical infrastructure, making emergency evacuation difficult. A conventional shortest-route approach may not always be suitable during a disaster because the shortest road may pass through a high-risk area.

This project addresses the problem by combining multiple hazard indicators and visualizing their spatial risk across the study area.

## Methodology

The system uses:

- SRTM Digital Elevation Model for slope analysis
- CHIRPS rainfall data for rainfall-risk analysis
- Sentinel-1 SAR data for flood-hazard change detection
- Slope and rainfall indicators for landslide susceptibility
- GHSL built-up data for settlement exposure
- Hospital and emergency-shelter locations
- Google Earth Engine for geospatial processing and visualization

The individual indicators are normalized to a common 0–1 scale and combined using a weighted Multi-Criteria Decision-Making (MCDM) approach.

## Multi-Hazard Risk Model

The final risk index combines:

- Flood Risk — 35%
- Landslide Susceptibility — 35%
- Rainfall Risk — 15%
- Slope Risk — 15%

The resulting index is visualized as a multi-hazard risk map ranging from lower to higher risk.

## Emergency Response

The system identifies important emergency assets such as hospitals and emergency shelters and displays an evacuation origin, emergency destination and emergency corridor on the interactive map.

The visualization is designed to support disaster-response decision making by providing a common spatial view of hazards and critical locations.

## Study Area

The case study focuses on Gangtok, Sikkim. The flood analysis uses the October 2023 Sikkim disaster event as the event-based flood case study.

## Technologies Used

- Google Earth Engine
- JavaScript
- Sentinel-1 SAR
- SRTM DEM
- CHIRPS
- GHSL
- Geospatial analysis
- Multi-Criteria Decision Making (MCDM)

## Key Outputs

- Multi-Hazard Risk Map
- Flood Hazard Layer
- Landslide Susceptibility Layer
- Rainfall Risk Layer
- Slope Risk Layer
- Settlement Exposure Layer
- Hospital Locations
- Emergency Shelter Locations
- Evacuation Origin
- Emergency Destination
- Emergency Corridor

## Purpose

The project demonstrates how satellite data, geospatial analysis and decision-support techniques can be integrated into an interactive disaster-risk visualization system for supporting emergency planning and response.
