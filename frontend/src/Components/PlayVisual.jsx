import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PlayVisual = () => {
  const id = useParams().id;
  const [playData, setPlayData] = useState({});

  // Typically a loading state is used to manage the UI while data is being fetched
  // const [isLoading, setIsLoading] = useState(true);
  // Set isLoading to false once data is fetched

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/play/${id}`);
        if (!response.ok) {
          throw new Error("Error fetching data.");
        }
        const data = await response.json();
        setPlayData(data);
      } catch (error) {
        console.error("Error fetching play data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <iframe
        width="560"
        height="315"
        src={playData.video_link}
        allow="autoplay; encrypted-media; picture-in-picture"
        sandbox="allow-scripts allow-same-origin"
        allowFullScreen
      ></iframe>
      <div className="stats">
        <h2>Play Details</h2>
        <p>
          <strong>Batter:</strong> {playData.batter}
        </p>
        <p>
          <strong>Pitcher:</strong> {playData.pitcher}
        </p>
        <p>
          <strong>Date:</strong> {playData.game_date}
        </p>
        <p>
          <strong>Outcome:</strong> {playData.play_outcome}
        </p>
        <p>
          <strong>Launch angle:</strong> {playData.launch_angle}
        </p>
        <p>
          <strong>Exit speed:</strong> {playData.exit_speed}
        </p>
        <p>
          <strong>Exit direction:</strong> {playData.exit_direction}
        </p>
        <p>
          <strong>Hit distance:</strong> {playData.hit_distance}
        </p>
        <p>
          <strong>Hang time:</strong> {playData.hang_time}
        </p>
        <p>
          <strong>Hit spin rate:</strong> {playData.hit_spin_rate}
        </p>
      </div>
    </>
  );
};

export default PlayVisual;
