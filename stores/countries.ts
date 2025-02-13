import { defineStore } from 'pinia'

export const useCountriesStore = defineStore('countries', {
    state: () => {
        return {
            countries: [] as string[],
            color: '#d3a7be' as string,
        }
    },
    actions: {
        toggleVisitedCountry(country: string) {
            if (this.countries.includes(country)) {
                this.countries = this.countries.filter(c => c !== country)
            } else {
                this.countries = [...this.countries, country]
            }
        },
        setCountries(countries: string[]) {
            this.countries = countries;
        },
        isVisitedCountry(country: string) {
            return this.countries.includes(country)
        },
        stringToColorOpacity30(username: string) {
            let hash = 0;
            for (let i = 0; i < username.length; i++) {
                hash = username.charCodeAt(i) + ((hash << 5) - hash);
            }
            let colour = '#';
            for (let i = 0; i < 3; i++) {
                let value = (hash >> (i * 16)) & 0xff;
                colour += ('00' + value.toString(16)).substr(-2);
            }
            this.color = `${colour}30`;
        }
    }
})
