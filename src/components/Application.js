//    Main application component responsible for rendering everything.

import React from "react";
import DayList from "./DayList";

import "components/Application.scss";
import "components/Appointment"
import Appointment from "components/Appointment/index";
import { getAppointmentsForDay, getInterview, getInterviewersForDay} from "helpers/selectors";

import useApplicationData from "hooks/useApplicationData";


export default function Application(props) {

  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();
 

  const dailyAppointments = getAppointmentsForDay(state,state.day);

  const dailyInterviewers = getInterviewersForDay(state,state.day);

  const appointmentsArray = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);

  return <Appointment 
    key={appointment.id}       
    id={appointment.id}
    time={appointment.time}
    interviewers = {dailyInterviewers}
    interview={interview} 
    bookInterview = {bookInterview}
    cancelInterview = {cancelInterview}
    />
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