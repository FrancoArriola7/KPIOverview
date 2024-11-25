import React, { useState } from "react";
import ReactFlagsSelect from "react-flags-select";

function CountrySelector() {
  const [ selected, setSelected ] = React.useState("");
  return (
  <CountrySelector
    selected={selected}
    onSelect={(code) => setSelected(code)}
    placeholder="Select Country"
    searchable
    searchPlaceholder="Search Countries"

    />
  )
}

export default CountrySelector;