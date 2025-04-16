import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { config } from './config';
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';



const SaleBillTable = () => {
  // State to store sale bills and pagination info
  const [saleBills, setSaleBills] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10,
  });
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch sale bills when page or filters change
  const fetchSaleBills = async (page = 1) => {
    try {
      const response = await axios.get(`${config.BASE_URL}/sales`, {
        params: {
          page,
          limit: pagination.limit,
          search,
          startDate,
          endDate,
        },
      });
      console.log('Sale Bills:', response);
      setSaleBills(response.data.saleBills);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching sale bills:', error);
    }
  };

  useEffect(() => {
    fetchSaleBills();
  }, [pagination.page, search, startDate, endDate]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination((prevState) => ({
      ...prevState,
      page: newPage,
    }));
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Handle date range change
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setSearch('');
    setStartDate('');
    setEndDate('');
    fetchSaleBills(1);
  };

  const NavigateTo = useNavigate()
  // sales
  const sale = async() =>{
    try{
       NavigateTo('/');
 
    }catch(error){
      console.error( error);
    }
  }

  // Handle delete sale bill

  const handleDelete = async (id: string) => {
    try{
    const res =  await axios.delete(`${config.BASE_URL}/sales/${id}`);
      toast.success(res.data.message);
      fetchSaleBills(pagination.page);
    }catch(error){
      console.error("Error deleting sale bill:", error);
    }
  }


  return (
    <div className="container mx-auto my-8">
      {/* Filter Section */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by Patient, Consultant, Location..."
            className="px-4 py-2 border border-gray-300 rounded"
          />
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="px-4 py-2 border border-gray-300 rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="px-4 py-2 border border-gray-300 rounded"
          />

          <button onClick={handleResetFilters}>
            <span className="px-4 py-2 bg-blue-500 text-white rounded">
              Reset
            </span>
          </button>
          <button onClick={sale}>
            <span className="px-4 py-2 bg-blue-500 text-white rounded">
              Sale
            </span>
          </button>
        </div>
      </div>

      {/* Sale Bills Table */}
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Patient Name</th>
            <th className="px-4 py-2 border">Consultant</th>
            <th className="px-4 py-2 border">Location</th>
            <th className="px-4 py-2 border">Store</th>
            <th className="px-4 py-2 border">Created At</th>
            <th className="px-4 py-2 border">Amount</th>
            <th className="px-4 py-2 border">Action</th>

          </tr>
        </thead>
        <tbody>
          {saleBills.map((bill,index) => (
            <tr key={bill._id} className="border-b">
              <td className="px-4 py-2">{index+1}</td>
              <td className="px-4 py-2">{bill.patientName}</td>
              <td className="px-4 py-2">{bill.consultant}</td>
              <td className="px-4 py-2">{bill.location}</td>
              <td className="px-4 py-2">{bill.store}</td>
              <td className="px-4 py-2">{new Date(bill.createdAt).toLocaleString()}</td>
              <td className="px-4 py-2">₹{bill.total.toFixed(2)}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleDelete(bill._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                 <MdDelete />
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Section */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
        <div>
          <span className="text-sm">
            Total Records: {pagination.totalRecords}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SaleBillTable;
