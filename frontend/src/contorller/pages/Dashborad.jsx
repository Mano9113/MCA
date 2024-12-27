import { useState, useEffect } from "react";
import Axios from "axios";
import DropDownItems from "./components/DropDownItems";
import Chart from "./components/Chart";
import { useNavigate, useLocation } from "react-router-dom";
import { setCookie, getCookie } from "./utils/cookies";
import "./style.css";
import UrlLoginPage from "./UrlLogin";
import config from "./config";  
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Initialize state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [filters, setFilters] = useState({
    name: queryParams.get("name") || getCookie("name") || "",
    class: queryParams.get("class") || getCookie("class") || "",
    startDate: queryParams.get("startDate")
      ? new Date(queryParams.get("startDate"))
      : getCookie("startDate")
      ? new Date(getCookie("startDate"))
      : new Date(currentYear, currentMonth + 1),
    endDate: queryParams.get("endDate")
      ? new Date(queryParams.get("endDate"))
      : getCookie("endDate")
      ? new Date(getCookie("endDate"))
      : new Date(currentYear, currentMonth + 1, 0),
  });
  const [selectedFeature, setSelectedFeature] = useState(
    queryParams.get("selectedFeature") || null
  );
  const [data, setData] = useState([]);

  // Verify token on page load
  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      setIsAuthenticated(false);
      return;
    }
    
    Axios.get(`${config.backendUrl}/verifyToken`, {
      params: { token },
    })
      .then(() => {
        setIsAuthenticated(true);
      })    
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  // Sync cookies and URL whenever filters or selectedFeature change
  useEffect(() => {
    // Update cookies
    setCookie("name", filters.name);
    setCookie("class", filters.class);
    setCookie("startDate", filters.startDate.toISOString());
    setCookie("endDate", filters.endDate.toISOString());

    // Update URL query parameters
    const params = new URLSearchParams({
      name: filters.name,
      class: filters.class,
      startDate: filters.startDate.toISOString().split("T")[0],
      endDate: filters.endDate.toISOString().split("T")[0],
    });
    if (selectedFeature) params.set("selectedFeature", selectedFeature);
    navigate(`?${params.toString()}`, { replace: true });
  }, [filters, selectedFeature, navigate]);

  // Fetch chart data
  const fetchChartData = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await Axios.get(`${config.backendUrl}/getChartData`, {
        params: {
          name: filters.name,
          class: filters.class,
          startDate: filters.startDate.toISOString().split("T")[0],
          endDate: filters.endDate.toISOString().split("T")[0],
        },
      });
      const sortedData = response.data.sort((a, b) => new Date(a.Date) - new Date(b.Date));
      setData(sortedData);
      console.log("setData", data)
    } catch (error) {
      setData(['']);
      toast.error("No data found matching the filters");
    }
  };

  // Fetch data when filters or authentication change
  useEffect(() => {
    fetchChartData();
  }, [filters]);

  // Refresh data when triggered by "Add Students"
  const refreshData = () => {
    fetchChartData(); // Refresh main chart data
  };

    // Logout handler
    const handleLogout = () => {
      const allCookies = document.cookie.split("; ");
      for (const cookie of allCookies) {
        const [name] = cookie.split("=");
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
      navigate("/"); // Redirect to login page
    };

  if (!isAuthenticated) {
    return <UrlLoginPage />;
  }

  // Render the dashboard if authenticated
  return (
    <div>
      {/* Logout Button */}
      <div className="d-flex justify-content-end m-3">
        <button className="btn btn-danger" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      {/* Filters */}
      <DropDownItems filters={filters} setFilters={setFilters} refreshData={refreshData} />

      {/* Charts */}
      <Chart
        data={data}
        selectedFeature={selectedFeature}
        setSelectedFeature={setSelectedFeature}
      />
    </div>
  );
};

export default Dashboard;