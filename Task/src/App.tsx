// import React from "react";
import SaleBill from "./Component/SaleBill";
import SaleBillTable from "./Component/SaleBillTable";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

const App = () => {

  
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<SaleBill/>} />
          <Route path="/sale" element={<SaleBillTable />} />


        </Routes>
        <ToastContainer />
      </Router>
    </div>
  );
};

export default App;
