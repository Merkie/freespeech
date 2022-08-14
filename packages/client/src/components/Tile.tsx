import { Component } from "solid-js";
import { css } from "solid-styled";

export interface ITileProps {
  text: string;
  iconsrc: string;
}

export const Tile: Component<ITileProps> = (props) => {

  css`
    div {
      width: fit-content;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      cursor: pointer;
    }
  `;

  return (
    <div onClick={() => alert(props.text)}>
      <img width={"50px"} src={props.iconsrc} alt={props.text} />
      <p>{props.text}</p>
    </div>
  )
}