// React component that shows an interview appointment.
//    This component has various modes that determine what is displayed,
//    and transitions between them (handled by the useVisualMode hook).

import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Status from "./Status";
import Error from "./Error";
import Confirm from "./Confirm";
import "components/Appointment/styles.scss";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const ERROR_DELETE = "ERROR_DELETE";
const ERROR_SAVE = "ERROR_SAVE";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

// Calling the bookInterview function while performing saving operation asynchronously before changing the mode to SHOW
  const save = (name, interviewer) => {
    if(!interviewer) throw new Error("Please enter interviewer");
      const interview = {
      student: name,
      interviewer,
    };

    transition(SAVING);

    props
      .bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW);
      })
      .catch(error => {
        transition(ERROR_SAVE, true);
      });
  };

  // Calling the cancelInterview function while performing delete operation asynchronously before changing the mode to EMPTY
  const deleteInterview = () => {
    transition(DELETING, true);

    props
      .cancelInterview(props.id)
      .then(() => {
        transition(EMPTY);
      })
      .catch(error => {
        transition(ERROR_DELETE, true);
      });
  };

  return (
    <article className="appointment">
      <Header time={props.time} />

      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}

      {mode === SAVING && <Status message="Saving" />}

      {mode === DELETING && <Status message="Deleting" />}

      {mode === ERROR_DELETE && (
        <Error message="Unexpected error happened while deleting" onClose={back} />
      )}

      {mode === ERROR_SAVE && (
        <Error message="Unexpected error happened while saving" onClose={back} />
      )}

      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back(EMPTY)}
          onSave={save}
        />
      )}

      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit ={() => transition(EDIT)}
        />
      )}

      {mode === EDIT && (
        <Form
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onCancel={() => back(SHOW)}
          onSave={save}
        />
      )}


      {mode === CONFIRM && (
        <Confirm
          message = "Are you sure you want to delete the appointment?"
          onCancel={() => transition(SHOW,true)}
          onConfirm= {deleteInterview}
        />
      )}
    </article>
  );
}