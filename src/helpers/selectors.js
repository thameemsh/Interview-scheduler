export function getAppointmentsForDay(state, day) {
  const appointmentday = state.days.filter(dy => dy.name === day);

  if (appointmentday.length === 0) {
    return [];
  }
  if (!appointmentday[0].appointments) {
    return [];
  }
  const filteredAppointments = appointmentday[0].appointments.map(appointmentid => state.appointments[appointmentid])
  return filteredAppointments
}

export function getInterviewersForDay(state, day) {
  const appointmentday = state.days.filter(dy => dy.name === day);

  if (appointmentday.length === 0) {
    return [];
  }
  if (!appointmentday[0].interviewers) {
    return [];
  }
  const filteredInterviewers = appointmentday[0].interviewers.map(interviewerid => state.interviewers[interviewerid])
  return filteredInterviewers
}

export function getInterview(state, interview) {
  if (!interview) {
    return null
  } else {
    return {
      student : interview.student,
      interviewer : state.interviewers[interview.interviewer]
    }
  };

}
