# Upcoming Development: Google Places API Integration

This document outlines how to use the **Google Places API** to search for restaurants by food name and retrieve the following details:

- Restaurant name
- Address
- Location (latitude/longitude)
- User ratings and reviews
- Opening hours
- Photos
- Price level (0–4)

---

## 1. Get a Google Places API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (if you don’t have one).
3. Enable the **Places API** and **Maps JavaScript API**.
4. Create an API key.

---

## 2. Example API Request

You can use the **Nearby Search** or **Text Search** endpoint.

### Sample Request (Text Search)
```
GET https://maps.googleapis.com/maps/api/place/textsearch/json?query=fried+chicken+restaurants+near+Delhi&key=YOUR_API_KEY
```

### Sample Request (Nearby Search)
```
GET https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=28.6139,77.2090&radius=5000&type=restaurant&keyword=fried+chicken&key=YOUR_API_KEY
```
- `location`: latitude,longitude (e.g., New Delhi)
- `radius`: in meters (e.g., 5000 = 5km)
- `type=restaurant`: restricts to restaurants
- `keyword`: food name

---

## 3. Example Response Fields

Each result will include:
- `name`
- `vicinity` (address)
- `geometry.location` (lat/lng)
- `rating`
- `user_ratings_total`
- `opening_hours` (if available)
- `photos` (photo references)
- `price_level` (0–4)

---

## 4. Example JavaScript Code (Node.js)

```js
const fetch = require('node-fetch');

const API_KEY = 'YOUR_GOOGLE_API_KEY';
const food = 'fried chicken';
const latitude = 28.6139; // New Delhi
const longitude = 77.2090;
const radius = 5000; // 5km

const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=restaurant&keyword=${encodeURIComponent(food)}&key=${API_KEY}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    const results = data.results.map(place => ({
      name: place.name,
      address: place.vicinity,
      location: place.geometry.location,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      opening_hours: place.opening_hours ? place.opening_hours.open_now : undefined,
      photos: place.photos ? place.photos.map(p => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${p.photo_reference}&key=${API_KEY}`) : [],
      price_level: place.price_level
    }));
    console.log(results);
  });
```

---

## 5. Get More Details (Reviews, Opening Hours, etc.)

To get **detailed reviews and full opening hours**, use the **Place Details API** with the `place_id` from the search result.

### Example:
```
GET https://maps.googleapis.com/maps/api/place/details/json?place_id=PLACE_ID&fields=name,rating,formatted_address,geometry,review,opening_hours,photos,price_level&key=YOUR_API_KEY
```

---

## 6. Summary Table of Fields

| Field             | Description                                 |
|-------------------|---------------------------------------------|
| name              | Restaurant name                             |
| vicinity          | Address                                     |
| geometry.location | Latitude/Longitude                          |
| rating            | Average user rating                         |
| user_ratings_total| Number of ratings                           |
| opening_hours     | Open now (boolean)                          |
| photos            | Array of photo URLs (need extra request)    |
| price_level       | 0–4 (see scale below)                       |
| reviews           | (from Place Details API)                    |

### Price Level Scale
- 0: Free
- 1: Inexpensive
- 2: Moderate
- 3: Expensive
- 4: Very Expensive

---

## Next Steps
- Replace `YOUR_GOOGLE_API_KEY` with your actual key.
- You can use this code in Node.js, or adapt it for the browser (with CORS handling).
- For each restaurant, if you want reviews or more details, make a follow-up request to the Place Details API using the `place_id`. 