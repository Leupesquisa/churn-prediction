import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import customerService from '../../services/CustomerServices';
import './CustomerDetails.css';

const CustomerDetails = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await customerService.getCustomerById(id);
        setCustomer(data);
      } catch (error) {
        console.error('Failed to fetch customer details', error);
      }
    };
    fetchCustomer();
  }, [id]);

  return (
    <div className="container">
      {customer ? (
        <div className="paper">
          <h1 className="customer-name">{customer.name}</h1>
          <p className="customer-info"><strong>Email:</strong> {customer.email}</p>
          <p className="customer-info"><strong>Tenure:</strong> {customer.tenure} months</p>
          <p className="customer-info"><strong>Monthly Charges:</strong> ${customer.monthlyCharges}</p>
          <p className="customer-info"><strong>Total Charges:</strong> ${customer.totalCharges}</p>
        </div>
      ) : (
        <p className="loading">Loading...</p>
      )}
    </div>
  );
};

export default CustomerDetails;
