/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#f0f7fd',
					100: '#e3f0fc',
					200: '#cce1f9',
					300: '#adccf4',
					400: '#8cafed',
					500: '#7192e3',
					600: '#5a75d7',
					700: '#465dbc',
					800: '#3b4e98',
					900: '#364679',
					950: '#202846'
				},
				'primary-dark': {
					50: '#f3f7fb',
					100: '#e5eaf4',
					200: '#d0dbed',
					300: '#b0c4e0',
					400: '#8aa5d0',
					500: '#6e89c3',
					600: '#5b72b5',
					700: '#5061a5',
					800: '#465187',
					900: '#484f6b',
					950: '#323855'
				},
				base: {
					0: '#F8F9F8',
					50: '#f7f8f8',
					100: '#eceef0',
					200: '#d7dce0',
					300: '#b5bec4',
					400: '#8c9ba4',
					500: '#6e7e89',
					600: '#586671',
					700: '#48535c',
					800: '#3e464e',
					900: '#373e43',
					950: '#24282d'
				},
				'base-dark': {
					50: '#f2f6fc',
					100: '#e2ebf7',
					200: '#ccdcf1',
					300: '#aac5e6',
					400: '#81a7d9',
					500: '#638bce',
					600: '#4f71c1',
					700: '#4560b0',
					800: '#3d4f90',
					900: '#262e4b',
					950: '#323855'
				}
			}
		}
	},
	plugins: [require('flowbite/plugin')]
};
