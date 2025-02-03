import { defineStore } from 'pinia'

export const useCountriesStore = defineStore('countries', {
    state: () => {
        return {
            countries: []
        }
    },
    actions: {
        toggleVisitedCountry(country) {
            if (this.countries.includes(country)) {
                this.countries = this.countries.filter(c => c !== country)
            } else {
                this.countries = [...this.countries, country]
            }
        },
        isVisitedCountry(country: string) {
            return this.countries.includes(country)
        }
    }
})
