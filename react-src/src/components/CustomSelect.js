import React from 'react';
import {IoIosArrowDown} from "react-icons/io";

const CustomSelect = ({className, currencies, value, onChange}) => {
  return <div className={`${className} select-cont`}>
    <select className="select-cont__select" value={value.value} onChange={onChange}>
      <option value="default" disabled>Choice</option>
      {currencies.map((currency) => {
        return <option key={currency.cc} value={currency.cc}>{currency.cc}</option>
      })}
    </select>
    <div className="select-cont__arrow">
      <IoIosArrowDown/>
    </div>
  </div>;
};

export default CustomSelect;