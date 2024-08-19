/* eslint @typescript-eslint/no-explicit-any: 0 */ // --> OFF

import {
	HomeIcon,
	GanttChartSquare,
	ShieldCheck,
	UserCircle,
	MoreHorizontal,
	ShieldHalf,
	Flame,
	Spline,
	Library,
	View,
	Book,
	PieChart,
	Send
} from 'lucide-svelte';

type IconType = {
	[key: string]: any;
};
export const componentLookup: IconType = {
	Home: HomeIcon,
	GanttChartSquare,
	ShieldCheck,
	UserCircle,
	MoreHorizontal,
	ShieldHalf,
	Flame,
	Spline,
	Library,
	View,
	Book,
	PieChart,
	Send
};
