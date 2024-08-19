import type { GroupedFormBData } from "./mpc";
import type { Options } from '$lib/types/form';

export type ApiResponse<T> =
	| {
			json: null;
			error: {
				message: string;
				[key: string]: string;
			};
	  }
	| {
			json: T;
			error: null;
	  };

export type User = {
	id: number;
	gender: string;
	date_of_birth: string;
	job: string;
	city: string;
	zipcode: string;
	latitude: number;
	profile_picture: string;
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	street: string;
	state: string;
	country: string;
	longitude: number;
};

export type UserResponsetype = {
	success: string;
	message: string;
	total_users: number;
	offset: number;
	limit: number;
	users: Array<User>;
};

export type UserDetails = {
	role: Role;
	user_lid: number;
	username: string;
	last_name: string;
	first_name: string;
	email: string;
	mobile: string;
};

export type UserSessionData = {
  user_detail: UserDetails;
  accessible_url: AccessibleUrl[];
};

export type AccessibleUrl = {
  url: string;
  icon: string;
  label: string;
	module: string | null
};

export type FormATable = {
	header: FormAHeader[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	points: any[];
};

export type countCourse = {
    count : number;
    date_array : string;
    ca_array : Options[];
}

export type FormATableGrouped = {
	header: FormAHeader[];
	points: {
		[key: string]: {
			campus_lid: number
			campus_name: string
			id: number
			point: string
			subPoint: string
			text: string
			type: string
		}[];
	};
};

export type FormAHeader = {
	id: number;
	name: string;
};

export type FormBTable = {
	header: FormBHeader[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	points: any[];
};

export type FormBType = {
	header: {
        id: number;
        name: string;
    }[];
    data: GroupedFormBData;
}

export type FormBHeader = {
	id: number;
	name: string;
};
