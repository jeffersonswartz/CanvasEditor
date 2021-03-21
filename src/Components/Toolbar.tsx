import React, { useContext } from "react";
import { CanvasContext } from "../CanvasContainer";

export const sizeList = [
  "8px",
  "9px",
  "10px",
  "11px",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "72px"
];

export const fontList = [
  "Arial",
  "Arial Black",
  "Arial Unicode MS",
  "Calibri",
  "Cambria",
  "Cambria Math",
  "Candara",
  `Segoe UI, wf_segoe-ui_normal, helvetica, arial, sans-serif`,
  "Comic Sans MS",
  "Consolas",
  "Constantia",
  "Corbel",
  "Courier New",
  "Georgia",
  "Lucida Sans Unicode",
  "Tahoma",
  "Times New Roman",
  "Trebuchet MS",
  "Verdana"
];

interface IToolbarProps {
  isEditEnable: boolean;
}

export default function Toolbar({ isEditEnable }: IToolbarProps) {
  const { actions } = useContext(CanvasContext);
  const addElement = (type: string) => {
    actions?.addElement(type);
  };
  return (
    <div style={{ display: "flex" }}>
      {isEditEnable && (
        <div id="toolbar">
          <select className="ql-font">
            {fontList.map((font) => (
              <option value={font}>{font}</option>
            ))}
          </select>
          <select className="ql-size">
            {sizeList.map((size) => (
              <option value={size}>{size}</option>
            ))}
          </select>
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <select className="ql-align" />
          <select className="ql-color" />
          <select className="ql-background" />
        </div>
      )}
      <div className="toolbar-item" onClick={() => addElement("TEXT")}>
        T
      </div>
      <div className="toolbar-item" onClick={() => addElement("IMAGE")}>
        I
      </div>
    </div>
    // <div className="toolbar-container">
    //   {/* <div className="toolbar-item" onClick={() => addElement("TEXT")}>
    //     T
    //   </div> */}
    //   {/* <div className="toolbar-item">Size</div>
    //   <div className="toolbar-item">B</div>
    //   <div className="toolbar-item">I</div>
    //   <div className="toolbar-item">U</div> */}
    //   <select
    //     className="ql-header"
    //     defaultValue={""}
    //     onChange={(e) => e.persist()}
    //   >
    //     <option value="1"></option>
    //     <option value="2"></option>
    //     <option selected></option>
    //   </select>
    //   <button className="ql-bold"></button>
    //   <button className="ql-italic"></button>
    //   <select className="ql-color">
    //     <option value="red"></option>
    //     <option value="green"></option>
    //     <option value="blue"></option>
    //     <option value="orange"></option>
    //     <option value="violet"></option>
    //     <option value="#d0d1d2"></option>
    //     <option selected></option>
    //   </select>
    // </div>
  );
}
