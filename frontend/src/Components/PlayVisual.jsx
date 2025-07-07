import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PlayVisual = () => {
  const id = useParams().id;
  const [playData, setPlayData] = useState({});
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
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
        allowFullScreen
      ></iframe>
    </>
  );
};

export default PlayVisual;
