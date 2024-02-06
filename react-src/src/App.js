import React, {useEffect, useState} from "react";
import "./css/index.css";
import {FaArrowRightArrowLeft} from "react-icons/fa6";
import Fields from "./components/Fields";
import Preloader from "./components/Preloader";

const url = "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchangenew?json";

function calculateValue(value, rate1, rate2) {
  if (value === "") {
    return "";
  }

  return (parseFloat(value) * rate1 / rate2).toFixed(2);
}

function checkInputIsDisabled(selectValue1, selectValue2) {
  return selectValue1.toLowerCase() === selectValue2.toLowerCase() || selectValue1.toLowerCase() === "default" || selectValue2.toLowerCase() === "default";
}

const App = () => {
  const [currencies, setCurrencies] = useState([]);
  const [values, setValues] = useState({
    input1: "",
    input2: "",
    select1: {value: "default", rate: 0},
    select2: {value: "default", rate: 0},
  });

  useEffect(() => {
    (async function () {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setCurrencies(data);
      } catch (e) {
        console.log(e)
      }
    }())
  }, [])

  function onChangeInput(e, inputName = "input1") {
    const value = e.target.value;

    // if (value.length === 0) {
    //   setValues({...values, input1: "", input2: ""});
    // }

    if (!/^\d*\.?\d{0,2}$/.test(value)) {
      return;
    }

    if (inputName === "input1") {
      setValues({...values, input1: value, input2: calculateValue(value, values.select1.rate, values.select2.rate)})
    } else {
      setValues({...values, input1: calculateValue(value, values.select2.rate, values.select1.rate), input2: value})
    }
  }

  function onChangeSelect(e, selectName = "select1") {
    const value = e.target.value;

    const {cc, rate} = currencies.find((currency) => {
      return currency.cc === value;
    })

    if (selectName === "select1") {
      setValues({
        ...values,
        select1: {value: cc, rate},
        input2: calculateValue(values.input1, rate, values.select2.rate)
      })
    } else {
      setValues({
        ...values,
        select2: {value: cc, rate},
        input1: calculateValue(values.input2, rate, values.select1.rate),
      })
    }
  }

  function onClickSwap() {
    if (checkInputIsDisabled(values.select1.value, values.select2.value)) {
      return;
    }

    setValues({input1: values.input2, input2: values.input1, select1: values.select2, select2: values.select1})
  }

  const inputIsDisabled = checkInputIsDisabled(values.select1.value, values.select2.value)

  return <>
    {!!currencies.length &&
      <>
        <Fields currencies={currencies}
                inputValue={values.input1}
                onChangeInput={(e) => onChangeInput(e)}
                inputIsDisabled={inputIsDisabled}
                selectValue={values.select1}
                onChangeSelect={(e) => onChangeSelect(e)}/>
        <button className="swap-btn" onClick={onClickSwap}>
          <FaArrowRightArrowLeft/>
        </button>
        <Fields className="fields2"
                currencies={currencies}
                inputValue={values.input2}
                onChangeInput={(e) => onChangeInput(e, "input2")}
                inputIsDisabled={inputIsDisabled}
                selectValue={values.select2}
                onChangeSelect={(e) => onChangeSelect(e, "select2")}/>
      </>
    }
    {!currencies.length && <Preloader/>}
  </>;
}

export default App;