import './css/styles.css';
import {fetchCountries} from './components/fetchCountries';
const _ = require('lodash');
import { Notify } from "notiflix";

const DEBOUNCE_DELAY = 500;

const refs = {
	input: document.querySelector("#search-box"),
	countryList: document.querySelector(".country-list"),
	countryInfo: document.querySelector(".country-info")
}

refs.input.addEventListener("input", _.debounce(onInputChange, DEBOUNCE_DELAY))

function onInputChange(e) {
	let currentInput = e.target.value.trim()
	let amountOfCountries = 0;

	if(!currentInput) {
		clearCountry()
		clearListOfCountries()
		return
	} else {
		fetchCountries(currentInput).then((data) => {
			if(data.length > 10) {
				Notify.info("Too many matches found. Please enter a more specific name.");
				return
			}

			if(data.length > 2) {
				clearCountry()
				renderListOfCountries(data)
			} 
			else if(data.length < 2) {
				clearListOfCountries()
				renderCountry(data)
			}
		})
	}

	function renderListOfCountries(data) {
		const markup = data
		.map((country) => {
			return `<li class="country-list__item">
				<img src="${country.flags.svg}"  class="country-list__flag"">
				<p>${country.name.common}</p>
			</li>`;
		})
		.join("")
		refs.countryList.innerHTML = markup
	}

	function clearListOfCountries() {
		refs.countryList.innerHTML = ''
	}

	function renderCountry(data) {
		const markup = data
		.map((country) => {
			const languages = Object.values(country.languages).join(', ')
			return `<div class="country-info__block">
			<img src="${country.flags.svg}" class="country-info__flag">
			<h2 class="country-info__name">${country.name.common}</h2>
		</div>
		<ul class="country-info__list">
			<li class="country-info__item"><span>Capital:</span> ${country.capital}</li>
			<li class="country-info__item"><span>Population:</span> ${country.population}</li>
			<li class="country-info__item"><span>Languages:</span> ${languages}</li>
		</ul>`
		})
		refs.countryInfo.innerHTML = markup
	 
	}
}

function clearCountry() {
	refs.countryInfo.innerHTML = ''
}


