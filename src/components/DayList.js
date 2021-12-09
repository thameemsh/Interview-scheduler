import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {
  const dayListItemsArray = props.days.map(day => 
    <DayListItem
      key={day.id}
      name={day.name}
      spots={day.spots}
      selected={day.name === props.value}
      setDay={props.onChange}
    />);

  return (
    <ul>
      {dayListItemsArray}
    </ul>
  );

}