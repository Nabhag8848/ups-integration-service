
curl -s -X POST http://localhost:3000/v1/rates/ups \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {
      "addressLines": ["100 Commerce Blvd", "Suite 200"],
      "city": "TIMONIUM",
      "stateProvinceCode": "MD",
      "postalCode": "21093",
      "countryCode": "US"
    },
    "destination": {
      "addressLines": ["742 Evergreen Terrace"],
      "city": "Alpharetta",
      "stateProvinceCode": "GA",
      "postalCode": "30005",
      "countryCode": "US"
    },
    "package": [
      {
        "dimensions": {
          "unitOfMeasurement": "IN",
          "length": 10,
          "width": 8,
          "height": 6
        },
        "weight": {
          "unitOfMeasurement": "LBS",
          "weight": 5
        }
      }
    ],
    "service": {
      "type": "GROUND"
    }
  }' | jq .
