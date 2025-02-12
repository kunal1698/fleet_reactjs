import React from 'react';

const YourComponent = () => {
  // Hardcoded form data
  const formData = {
    loginkey: 'sampleLoginKey',
    passkey: 'samplePassKey',
    RevenueMonth: '2024-07',
    ClientName: 'Sample Client',
    ReferenceNumber: 'REF123456',
    Docket: 'DOCK1234',
    InvoiceNumber: 'INV123456',
    Mode: 'Air',
    VolMetric: '100',
    VolWeight: '150',
    ActWeight: '145',
    ChargWeight: '150',
    ProductId: 'PROD123',
    TotalMovementCost: '2000',
    GST: '360',
    GrandTotal: '2360',
    BookingDate: '2024-07-15',
    BookingAddress: '123 Sample St',
    BookingCity: 'Sample City',
    BookingState: 'Sample State',
    DeliveryDate: '2024-07-20',
    DeliveryAddress: '456 Delivery St',
    DeliveryCity: 'Delivery City',
    DeliveryState: 'Delivery State',
    AddUser: 'user123',
    InvoiceId: ['INV123456'],
    InvoiceDate: ['2024-07-15'],
    Description: ['Sample Description'],
    AmountItem: ['2000'],
    EwayBillNumber: ['EWB123456'],
    EWBDate: ['2024-07-14']
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const baseUrl = 'https://vsl.svgcso.com/vsl_web.asmx/insertAddBooking';

    const data = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          data.append(`${key}[${index}]`, item);
        });
      } else {
        data.append(key, value);
      }
    });

    // Send POST request
    fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: data
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <button type="submit">Submit</button>
    </form>
  );
};

export default YourComponent;
