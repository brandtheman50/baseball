import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TableVisual = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    batter: "",
    pitcher: "",
    date: "",
    outcome: "",
  });

  const fetchData = async () => {
    try {
      const query = new URLSearchParams();

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
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilters = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="page-cont">
        <h1 className="page-title">Braves Play Search</h1>
        <div className="search-cont">
          <input
            type="text"
            name="pitcher"
            className="text-filter"
            placeholder="Pitcher Name"
            value={filters.pitcher}
            onChange={updateFilters}
          />
          <input
            type="text"
            name="batter"
            className="text-filter"
            placeholder="Batter Name"
            value={filters.batter}
            onChange={updateFilters}
          />
          <input
            type="date"
            name="date"
            className="text-filter"
            value={filters.date}
            onChange={updateFilters}
          />
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
          <button className="search-button" onClick={fetchData}>
            Search
          </button>
        </div>
        <div className="results-cont">
          <table className="tableStyle">
            <thead>
              <tr className="tableHeader">
                <th>Pitcher</th>
                <th>Batter</th>
                <th>Date</th>
                <th>Outcome</th>
              </tr>
            </thead>
            <tbody>
              {data.map((play) => (
                <tr key={play.id} onClick={() => navigate(`/play/${play.id}`)}>
                  <td>{play.pitcher}</td>
                  <td>{play.batter}</td>
                  <td>{play.game_date}</td>
                  <td>{play.play_outcome}</td>
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
