GET /v1/rates/:carrier



ShipFrom {
    "Address": {
        "AddressLine": [
        "ShipFromAddressLine",
        "ShipFromAddressLine",
        "ShipFromAddressLine"
        ],
        "City": "Alpharetta",
        "StateProvinceCode": "GA",
        "PostalCode": "30005",
        "CountryCode": "US"
   }
}  

ShipTo {
    "Address": {
        "AddressLine": [
        "ShipFromAddressLine",
        "ShipFromAddressLine",
        "ShipFromAddressLine"
        ],
        "City": "Alpharetta",
        "StateProvinceCode": "GA",
        "PostalCode": "30005",
        "CountryCode": "US"
   }
}

Package [
    {
        PackagingType: {
            Code
            Description
        }
    },
    {
        Dimensions: {
            UnitOfMeasurement {
                Code
                Description
            }
        }
        Length
        Width
        Height
    }
    PackageWeight {
        UnitOfMeasurement {
            Code
            Description
        }
        Weight
    }
]

Service {
    Code
    Description?
}


Response {
    TotalCharges {
        CurrencyCode
        MonetaryValue
    }
    TransportationCharges {
        CurrencyCode
        MonetaryValue
    }
    RatedShipment [{
        Service {
            Code
            Description
        }
    }]
}


RateRequest: {
    Request: {
        Subversion: "2409"    
    }
    Shipment: {
        Shipper: {
        (populate origin in form below)
            "Address": {
                "AddressLine": [
                "string",
                "string",
                "string"
                ],
                "City": "Alpharetta",
                "StateProvinceCode": "GA",
                "PostalCode": "30005",
                "CountryCode": "US"
            }
        }
        ShipForm: {...same payload as shipper}
        ShipTo: {
            same format as shipper but destination
        }
        Service: {
            code <- if service code provided in payload
        }
        Package: [{
            PackagingType: {
                Code
            }
        },
          { Dimensions: {
            UnitOfMeasurement {
                Code
                Description
            }
           Length,
           Width,
           Height,
          } 
          }, { DimWeight : { } }
          {PackageWeight {
        UnitOfMeasurement {
            Code
            Description
        }
        Weight
    }  }
        ]
    }

}

