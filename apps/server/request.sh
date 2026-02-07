
curl -s -X POST http://localhost:3000/v1/rates/ups \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {
      "addressLines": ["100 Main St"],
      "city": "Alpharetta",
      "stateProvinceCode": "GA",
      "postalCode": "30005",
      "countryCode": "US"
    },
    "destination": {
      "addressLines": ["200 Oak Ave"],
      "city": "Atlanta",
      "stateProvinceCode": "GA",
      "postalCode": "30301",
      "countryCode": "US"
    },
    "package": {
      "packagingType": {
        "code": "02"
      },
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
    },
    "service": {
      "code": "03"
    }
  }' | jq .