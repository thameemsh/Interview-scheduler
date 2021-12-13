import React, { useState,useEffect } from "react";
import axios from "axios";
import DayList from "./DayList";

import "components/Application.scss";
import "components/Appointment"
import Appointment from "components/Appointment/index";
import { getAppointmentsForDay, getInterview, getInterviewersForDay} from "helpers/selectors";



export default function Application(props) {

 const [state, setState] = useState ({
   day : "Monday",
   days : [],
   appointments : {},
   interviewers : {}
 });


 const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers")
    ]).then((all) => {
      setState(prev => ({...prev, days:all[0].data, appointments:all[1].data, interviewers:all[2].data}))
    })
  }, [])

  const dailyAppointments = getAppointmentsForDay(state,state.day);

  const dailyInterviwers = getInterviewersForDay(state,state.day);

  const appointmentsArray = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);

  return <Appointment 
    key={appointment.id}       
    id={appointment.id}
    time={appointment.time}
    interviewers = {dailyInterviwers}
    interview={interview} />
  } )

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            value={state.day}
            onChange={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentsArray}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
