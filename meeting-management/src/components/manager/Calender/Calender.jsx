import React, { useEffect, useState } from "react";
import "./calender.css";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import MeetingDetails from "../meetingDetails/meetingDetails.jsx";
import {Helmet} from "react-helmet";

function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
  const isSelected =
    !props.outsideCurrentMonth &&
    highlightedDays.indexOf(props.day.date()) >= 0;
  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? "🕑" : undefined}
      style={{ cursor: "pointer", userSelect: "none" }}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}
export default function Calender() {
  const [highlightedDays, setHighlightedDays] = useState([1, 2, 30]);
  const newTheme = (theme) =>
    createTheme({
      ...theme,
      components: {
        MuiDateCalendar: {
          styleOverrides: {
            root: {
              color: "#343A46",
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "#343A46",
              border: "1px solid",
              backgroundColor: "#99A1B3",
              minHeight: 350,
              width: "100%",
            },
          },
        },
      },
    });
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let today = new Date();
  let [date, setDate] = useState({
    $D: today.getDate(),
    $M: today.getMonth(),
    $y: today.getFullYear(),
  });
  let [day, setDay] = useState(weekday[new Date().getDay()]);
  function monthChanged(month) {
    console.log(month);
    setHighlightedDays([20, 25, 1]);
  }
  return (
    <div className="main py-5  px-md-5">
      <div className="container  d-flex flex-column justify-content-center align-items-center ">
        <h2 className="mb-5 animate__animated animate__zoomIn">Calender</h2>
        <div className="calenderCard rounded-4 p-sm-4">
          <div className="row my-3 gy-3">
            <div className="col-lg-6 p-4">
              <ThemeProvider theme={newTheme}>
                <DateCalendar
                  showDaysOutsideCurrentMonth
                  fixedWeekNumber={6}
                  onChange={(val) => {
                    setDate(val);
                    setDay(weekday[new Date(val).getDay()]);
                  }}
                  onMonthChange={(val) => monthChanged(val.$M + 1)}
                  slots={{
                    day: ServerDay,
                  }}
                  slotProps={{
                    day: {
                      highlightedDays,
                    },
                  }}
                />
              </ThemeProvider>
            </div>
            <div className="col-lg-6">
              <div className="dayMeetings p-4">
                <div
                  style={{ color: "var(--mutedColor)" }}
                  className="todayDate d-flex justify-content-between mb-3"
                >
                  <span>{day}</span>
                  <span>
                    {date.$D}/{date.$M + 1}/{date.$y}
                  </span>
                </div>
                <div className="dayMeetingsCards">
                  <div className="meetingItem border-bottom py-3">
                    <p>Meeting Topic : blblsbab</p>
                    <p>Meeting Time : 1:00</p>
                    <a
                      data-bs-toggle="modal"
                      data-bs-target="#meetingModal"
                      className="mb-3 cursorPointer"
                    >
                      Show Details
                    </a>
                  </div>
                  <div className="meetingItem border-bottom py-3">
                    <p>Meeting Topic : blblsbab</p>
                    <p>Meeting Time : 2:00</p>
                    <a
                      data-bs-toggle="modal"
                      data-bs-target="#meetingModal"
                      className="mb-3 cursorPointer"
                    >
                      Show Details
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <MeetingDetails />
          </div>
        </div>
      </div>
      <Helmet>
        <title>Calendar</title>
      </Helmet>
    </div>
  );
}
