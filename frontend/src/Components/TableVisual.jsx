import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// TableVisual: Displays a searchable and filterable table of baseball plays
const TableVisual = () => {
  // Holds the list of play data returned from the backend
  const [data, setData] = useState([]);

  // React Router hook to programmatically navigate to a play's detail view
  const navigate = useNavigate();

  // Filter inputs for querying the API
  const [filters, setFilters] = useState({
    batter: "",
    pitcher: "",
    date: "",
    outcome: "",
  });

  // Column headers for the table
  const headers = [
    "Pitcher",
    "Batter",
    "Date",
    "Outcome",
    "Launch Angle",
    "Exit Speed",
    "Hit Distance",
  ];

  // Fetch filtered data from the Flask backend API
  const fetchData = async () => {
    try {
      const query = new URLSearchParams();

      // Append filters if present
      if (filters.batter) query.append("batter", filters.batter);
      if (filters.pitcher) query.append("pitcher", filters.pitcher);
      if (filters.date) query.append("date", filters.date);
      if (filters.outcome) query.append("outcome", filters.outcome);

      const response = await fetch(
        `http://localhost:5000/api/data?${query.toString()}`
      );
      const json = await response.json();
      setData(json);
    } catch (e) {
      console.log("Error fetching data:"), e;
    }
  };

  // Handle input changes in filter fields
  const updateFilters = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Initial fetch when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="page-cont">
        <h1 className="page-title">Braves Play Search</h1>

        {/* Search filter inputs: for more logic or functionality, create custom component for input fields */}
        <div className="search-cont">
          {/* Pitcher input */}
          <input
            type="text"
            name="pitcher"
            className="text-filter"
            placeholder="Pitcher Name"
            value={filters.pitcher}
            onChange={updateFilters}
          />
          {/* Batter input */}
          <input
            type="text"
            name="batter"
            className="text-filter"
            placeholder="Batter Name"
            value={filters.batter}
            onChange={updateFilters}
          />
          {/* Date input */}
          <input
            type="date"
            name="date"
            className="text-filter"
            value={filters.date}
            onChange={updateFilters}
          />
          {/* Outcome dropdown */}
          <select
            className="text-filter"
            name="outcome"
            value={filters.outcome}
            onChange={updateFilters}
          >
            <option value="">Select Play Type</option>
            <option value="out">Out</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="triple">Triple</option>
            <option value="homerun">HomeRun</option>
          </select>

          {/* Fetch filtered results */}
          <button className="search-button" onClick={fetchData}>
            Search
          </button>
        </div>

        {/* Results Table */}
        <div className="results-cont">
          <h4>Click on any row to see video and other stats.</h4>

          <table className="tableStyle">
            <thead>
              <tr className="tableHeader">
                {/* Render table headers */}
                {headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Render each play as a row */}
              {data.map((play) => (
                <tr
                  key={play.id}
                  onClick={() => navigate(`/play/${play.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{play.pitcher}</td>
                  <td>{play.batter}</td>
                  <td>{play.game_date}</td>
                  <td>{play.play_outcome}</td>
                  <td>{play.launch_angle}</td>
                  <td>{play.exit_speed}</td>
                  <td>{play.hit_distance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableVisual;
