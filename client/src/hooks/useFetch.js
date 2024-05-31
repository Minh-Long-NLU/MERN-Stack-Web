import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(url);
      setData(res.data);
      setError(null); 
    } catch (err) {
      setError(err);
      setData([]); 
    }
    setLoading(false);
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, reFetch: fetchData };
};

export default useFetch;
