export function getAppointmentsForDay(state, day) {
  const appointmentday = state.days.filter(dy => dy.name === day);

  if(appointmentday.length === 0) {
    return [];
  }
  if (!appointmentday[0].appointments) {
    return [];
  }
  const filteredAppointments = appointmentday[0].appointments.map(appointmentid => state.appointments[appointmentid])
  return filteredAppointments
}

