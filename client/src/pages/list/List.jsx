import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import React from 'react';
import useFetch from "../../hooks/useFetch";

const List = () => {
  const location = useLocation();
  const [destination, setDestination] = useState(location.state?.destination || "");
  const [date, setDate] = useState(location.state?.date || [{ startDate: new Date(), endDate: new Date(), key: 'selection' }]);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(location.state?.options || { adult: 1, children: 0, room: 1 });
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(999);

  const { data, loading, error, reFetch } = useFetch(
    `/hotels?city=${destination}&min=${min}&max=${max}`
  );

  const handleSearch = () => {
    let query = "/hotels?";
    if (destination) query += `city=${destination}&`;
    if (min) query += `min=${min}&`;
    if (max) query += `max=${max}&`;
    reFetch(query.slice(0, -1)); // Remove trailing '&'
  };

  useEffect(() => {
    reFetch();
  }, []);

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Destination</label>
              <input
                placeholder="Destination"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="lsItem">
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(
                date[0].startDate,
                "MM/dd/yyyy"
              )} to ${format(date[0].endDate, "MM/dd/yyyy")}`}</span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDate([item.selection])}
                  minDate={new Date()}
                  ranges={date}
                />
              )}
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Min price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    className="lsOptionInput"
                    value={min}
                    onChange={(e) => setMin(e.target.value)}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    className="lsOptionInput"
                    value={max}
                    onChange={(e) => setMax(e.target.value)}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.adult}
                    onChange={(e) =>
                      setOptions((prev) => ({ ...prev, adult: e.target.value }))
                    }
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    placeholder={options.children}
                    onChange={(e) =>
                      setOptions((prev) => ({
                        ...prev,
                        children: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.room}
                    onChange={(e) =>
                      setOptions((prev) => ({ ...prev, room: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>
            <button onClick={handleSearch}>Search</button>
          </div>
          <div className="listResult">
            {loading ? (
              "Loading, please wait!"
            ) : error ? (
              <p>Error: {error.message}</p>
            ) : (
              Array.isArray(data) && data.length > 0 ? (
                data.map((item) => (
                  <SearchItem item={item} key={item._id} />
                ))
              ) : (
                <p>No results found</p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
