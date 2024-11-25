import {COUNTRIES} from "./Countries";

export const SelectMenuOption = COUNTRIES.map(country => ({
    title: country.title,
    value: country.value
  }));