import { CircularProgress } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import OverallScore from "../components/circularProgress.tsx";
import Breakdown from "../components/breakdown.tsx";
import axios from "axios";
import "./dashboardPage.css";

const DashboardPage = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        const response = await axios.post('http://127.0.0.1:5000/analyze-cv', { /* CV data */ });
        setData(response.data);
        setLoading(false);
      };
  
      fetchData();
    }, []);
  
    if (loading) return <CircularProgress />;
  
    return (
      <div className="dashboardPage">
        <OverallScore score={data.overall_score} />
        <Breakdown sections={data.breakdown} />
      </div>
    );
  };

export default DashboardPage;
  