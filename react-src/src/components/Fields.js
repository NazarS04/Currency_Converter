import React from 'react';
import CustomSelect from "./CustomSelect";

const Fields = (props) => {
  let inputClassName = "fields__input";
  if (props.inputIsDisabled) {
    inputClassName += " fields__input_disabled";
  }

  return <div className={`${props.className} fields`}>
    <CustomSelect className="fields__select" currencies={props.currencies} value={props.selectValue}
                  onChange={props.onChangeSelect}/>
    <input type="text" disabled={props.inputIsDisabled} placeholder={props.inputIsDisabled ? "Disabled" : ""}
           className={inputClassName}
           value={props.inputValue} onChange={props.onChangeInput}/>
  </div>;
};

export default Fields;