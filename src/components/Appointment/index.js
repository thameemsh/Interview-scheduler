import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Status from "./Status";
import "components/Appointment/styles.scss";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
export default function Appointment(props) {

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY);

    function save(name, interviewer) {
      const interview = {
        student: name,
        interviewer
      };

      const bookInterviewPromise = () => {
        return new Promise((resolve) => {
          props.bookInterview(props.id, interview)
          resolve()
      })
    }
      bookInterviewPromise().then(() => {
        setTimeout(() =>transition(SAVING),50);
        setTimeout(() =>transition(SHOW),750);
      })

    }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SAVING && <Status message="Saving" /> } 
      {mode === CREATE && (
        <Form
          interviewers = {props.interviewers}
          onCancel = {() => back(EMPTY)}
          onSave ={save}
        />
      )}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}
    </article>
  );
}