import {FontAwesome5} from "@expo/vector-icons";
import React, {ReactElement} from "react";

export function MasteryIcons(mastery: number): ReactElement {
  let iconName;
  if (mastery === 0) {
    iconName = "star-half-alt";
  } else if (mastery === 1) {
    iconName = "grin-stars";
  } else if (mastery === 2) {
    iconName = "star";
  } else {
    iconName = "star";
  }
  return <FontAwesome5 name={iconName} size={24} color="black"/>;
}
