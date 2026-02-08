/**
 * Stubbed UPS Rate response for a single service (/Rate endpoint).
 * Based on the UPS Rating API documentation with realistic values.
 * This is what UPS returns when you request a rate for a specific service code.
 */
export const STUB_UPS_RATE_RESPONSE_SINGLE = {
  RateResponse: {
    Response: {
      ResponseStatus: { Code: '1', Description: 'Success' },
      Alert: [
        {
          Code: '110971',
          Description:
            'Your invoice may vary from the displayed reference rates',
        },
      ],
      TransactionReference: { CustomerContext: 'CustomerContext' },
    },
    RatedShipment: {
      Disclaimer: [
        {
          Code: '01',
          Description:
            'Taxes are included in the shipping cost and apply to the transportation charges but additional duties/taxes may apply and are not reflected in the total amount due.',
        },
      ],
      Service: { Code: '03', Description: 'UPS Ground' },
      RatedShipmentAlert: [
        {
          Code: '110971',
          Description:
            'Your invoice may vary from the displayed reference rates',
        },
      ],
      BillingWeight: {
        UnitOfMeasurement: { Code: 'LBS', Description: 'Pounds' },
        Weight: '5.0',
      },
      TransportationCharges: { CurrencyCode: 'USD', MonetaryValue: '12.35' },
      BaseServiceCharge: { CurrencyCode: 'USD', MonetaryValue: '12.35' },
      ServiceOptionsCharges: { CurrencyCode: 'USD', MonetaryValue: '0.00' },
      TotalCharges: { CurrencyCode: 'USD', MonetaryValue: '15.72' },
      RatedPackage: [
        {
          TransportationCharges: {
            CurrencyCode: 'USD',
            MonetaryValue: '12.35',
          },
          ServiceOptionsCharges: {
            CurrencyCode: 'USD',
            MonetaryValue: '0.00',
          },
          TotalCharges: { CurrencyCode: 'USD', MonetaryValue: '15.72' },
          Weight: '5.0',
          BillingWeight: {
            UnitOfMeasurement: { Code: 'LBS', Description: 'Pounds' },
            Weight: '5.0',
          },
        },
      ],
      TimeInTransit: {
        PickupDate: '20250120',
        PackageBillType: '03',
        ServiceSummary: {
          Service: { Description: 'UPS Ground' },
          EstimatedArrival: {
            Arrival: { Date: '20250124', Time: '233000' },
            BusinessDaysInTransit: '4',
            DayOfWeek: 'FRI',
            TotalTransitDays: '4',
          },
        },
      },
    },
  },
};

/**
 * Stubbed UPS Shop response (/Shop endpoint) — returns multiple services.
 * This is what UPS returns when no service code is specified,
 * so it "shops" across all available services.
 */
export const STUB_UPS_RATE_RESPONSE_MULTIPLE = {
  RateResponse: {
    Response: {
      ResponseStatus: { Code: '1', Description: 'Success' },
      Alert: [
        {
          Code: '110971',
          Description:
            'Your invoice may vary from the displayed reference rates',
        },
      ],
      TransactionReference: { CustomerContext: 'CustomerContext' },
    },
    RatedShipment: [
      {
        Service: { Code: '03', Description: 'UPS Ground' },
        BillingWeight: {
          UnitOfMeasurement: { Code: 'LBS', Description: 'Pounds' },
          Weight: '5.0',
        },
        TransportationCharges: { CurrencyCode: 'USD', MonetaryValue: '12.35' },
        ServiceOptionsCharges: {
          CurrencyCode: 'USD',
          MonetaryValue: '0.00',
        },
        TotalCharges: { CurrencyCode: 'USD', MonetaryValue: '15.72' },
        RatedPackage: [
          {
            TransportationCharges: {
              CurrencyCode: 'USD',
              MonetaryValue: '12.35',
            },
            ServiceOptionsCharges: {
              CurrencyCode: 'USD',
              MonetaryValue: '0.00',
            },
            TotalCharges: { CurrencyCode: 'USD', MonetaryValue: '15.72' },
            Weight: '5.0',
          },
        ],
      },
      {
        Service: { Code: '02', Description: 'UPS 2nd Day Air' },
        BillingWeight: {
          UnitOfMeasurement: { Code: 'LBS', Description: 'Pounds' },
          Weight: '5.0',
        },
        TransportationCharges: { CurrencyCode: 'USD', MonetaryValue: '28.50' },
        ServiceOptionsCharges: {
          CurrencyCode: 'USD',
          MonetaryValue: '0.00',
        },
        TotalCharges: { CurrencyCode: 'USD', MonetaryValue: '33.10' },
        RatedPackage: [
          {
            TransportationCharges: {
              CurrencyCode: 'USD',
              MonetaryValue: '28.50',
            },
            ServiceOptionsCharges: {
              CurrencyCode: 'USD',
              MonetaryValue: '0.00',
            },
            TotalCharges: { CurrencyCode: 'USD', MonetaryValue: '33.10' },
            Weight: '5.0',
          },
        ],
      },
      {
        Service: { Code: '01', Description: 'UPS Next Day Air' },
        BillingWeight: {
          UnitOfMeasurement: { Code: 'LBS', Description: 'Pounds' },
          Weight: '5.0',
        },
        TransportationCharges: { CurrencyCode: 'USD', MonetaryValue: '55.80' },
        ServiceOptionsCharges: {
          CurrencyCode: 'USD',
          MonetaryValue: '0.00',
        },
        TotalCharges: { CurrencyCode: 'USD', MonetaryValue: '62.45' },
        RatedPackage: [
          {
            TransportationCharges: {
              CurrencyCode: 'USD',
              MonetaryValue: '55.80',
            },
            ServiceOptionsCharges: {
              CurrencyCode: 'USD',
              MonetaryValue: '0.00',
            },
            TotalCharges: { CurrencyCode: 'USD', MonetaryValue: '62.45' },
            Weight: '5.0',
          },
        ],
      },
    ],
  },
};
