import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import customerService from '../../services/CustomerServices';
import './CustomerTable.css';

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await customerService.getCustomers();
        setCustomers(data);
      } catch (error) {
        console.error('Failed to fetch customers', error);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="table-container">
      <table className="customer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Tenure</th>
            <th>Monthly Charges</th>
            <th>Total Charges</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.tenure}</td>
              <td>${customer.monthlyCharges}</td>
              <td>${customer.totalCharges}</td>
              <td>
                <Link to={`/customer/${customer.id}`} className="details-button">
                  Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
