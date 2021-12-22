import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers"),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  // To get the free spots available for the current day.
  const getFreeSpots = (state, appointments) => {
    const appointmentDay = state.days.filter((day) => day.name === state.day);
    const appointmentsToday = appointmentDay[0].appointments;
    const emptySpots = appointmentsToday.filter((appointment) => !appointments[appointment].interview).length;
    return emptySpots;
  };

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const days = [...state.days];
    const dayIndex = state.days.findIndex((day) =>
      day.appointments.includes(id)
    );
    const spots = getFreeSpots(state, appointments);

    const newDay = {
      ...days[dayIndex],
      spots,
    };
    days[dayIndex] = newDay;
   
    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then(() => {
        setState({ ...state, appointments: appointments, days: days });
      });
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const days = [...state.days];
    const dayIndex = state.days.findIndex((day) =>
      day.appointments.includes(id)
    );
    const spots = getFreeSpots(state, appointments);

    const newDay = {
      ...days[dayIndex],
      spots,
    };
    days[dayIndex] = newDay;

    return axios
      .delete(`http://localhost:8001/api/appointments/${id}`)
      .then(() =>
        setState({ ...state, appointments: appointments, days: days })
      );
  }

  return { state, setDay, bookInterview, cancelInterview };
}


// Previous code for updating the spots. I kept it for future reference. Also need to fix the bug in it that makes and update to spot when database is run in error mode.

  // function dayOfTheWeek(day) {
  //   const dayOfWeek = {
  //     Monday: 0,
  //     Tuesday: 1,
  //     Wednesday: 2,
  //     Thursday: 3,
  //     Friday: 4,
  //   };
  //   return dayOfWeek[day];
  // }

  //Inside bookInterview() 
    
  // const dayOfWeek = dayOfTheWeek(state.day);
  // let day = {
  //   ...state.days[dayOfWeek],
  //   spots: state.days[dayOfWeek],
  // };
  // if (!state.appointments[id].interview) {
  //   day = {
  //     ...state.days[dayOfWeek],
  //     spots: state.days[dayOfWeek].spots - 1,
  //   };
  // } else { //When Editing the count must not change
  //   day = {
  //     ...state.days[dayOfWeek],
  //     spots: state.days[dayOfWeek].spots,
  //   };
  // }
  // let days = state.days;
  // days[dayOfWeek] = day;

  //Inside cancelInterview() 

    // const dayOfWeek = dayOfTheWeek(state.day);

    // const day = {
    //   ...state.days[dayOfWeek],
    //   spots: state.days[dayOfWeek].spots + 1,
    // };

    // let days = state.days;
    // days[dayOfWeek] = day;