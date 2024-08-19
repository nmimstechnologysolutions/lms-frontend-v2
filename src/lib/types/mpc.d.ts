//User-Faculty ===>>>>

import type { FormAHeader } from ".";
import type { Options } from "./form";

export type FacultyRole = {
    usersessionLid: number;
    username: string;
    program_lid: number;
    facultyName: string;
    isProgramAnchor: boolean | null;
    isCourseAnchor: boolean | null;
}

export type AssignUserData = {
    usersessionLid: number;
    isProgramAnchor: boolean | null;
    isCourseAnchor: boolean | null;
}

export type UserRoleResult = {
    user_session_lid: number;
    username: string;
    first_name: string;
    last_name: string;
    acad_session: string;
    program_id: number;
    program_name: string;
    program_code: string;
    subject_name: string;
    subject_abbr: string;
    organization_id: number;
    organization_name: string;
    organization_abbr: string;
    campus_id: number;
    campus_name: string;
    campus_abbr: string;
    is_program_anchor: boolean;
    is_course_anchor: boolean;
};

export type UserAndCampus = {
    user_session_lid: number;
    username: string;
    campus_id: string;
    last_name: string;
    first_name: string;
    campus_abbr: string;
    campus_name: string;
};

export type MPCRoleJson = {
    course_anchor: UserAndCampus[]
    program_anchor: UserAndCampus[]
    attendees: UserAndCampus[]
    absentees: UserAndCampus[]
}

export type MasterFormList = {
    meeting_id: number;
    meeting_date: string;
    meeting_date_timestamp: string;
    meeting_name: string
    meeting_description: string
    program_lid: number;
    subject_lid: number;
    acad_year: string;
    subject_id: string;
    subject_name: string;
    subject_abbr: string;
    program_name: string;
    program_id: string;
    program_code: string;
    session_lid: number;
    acad_session: string;
}

export type MasterFormListSession = {
    meeting_id: number;
    meeting_name: string;
    meeting_date: string;
    final_submit: boolean;
    program_lid: number;
    subject_lid: number;
    acad_year: string;
    acad_session: string;
    subject_id: string;
    subject_name: string;
    subject_abbr: string;
    program_id: string;
    program_name: string;
    program_code: string;
}

export type SingleMasterFormRequestObject = {
    master_data: MasterFormList;
    master_form_users: MPCRoleJson;
}

export type MasterFormUserResponse = {
    course_anchor: Options[];
    program_anchor: Options[];
    attendees: Options[];
}

//Form-A ===>>>>

export type FormAType = {
    header: {
        id: number;
        name: string;
    }[];
    points: {
        id: number;
        point: string;
        subPoint: string;
        campus_lid: number;
        campus_name: string;
        type: string;
        text: string;
    }[];
}

type FormAObject = {
    meetingId: number;
    jsonToSend: JsonType[];
    attendees: (string | number)[];
    absentees: (string | number)[];
    isFinalSubmit: boolean;
};

type FormAList = {
    meeting_id: number;
    meeting_name: string;
    program_name: string;
    subject_name: string;
    acad_year: string;
    final_submit: boolean;
}

export type MeetingdataForFormA = {
    meetingId: number;
    attendeesValue : (string | number)[];
    absenteesvalue : (string | number)[];
}

type JsonType = {
    point_id: number;
    campus_id: string;
    text: string;
};

export type FormADetail = {
    attendees: UserAndCampus[];
    absentees: UserAndCampus[];
    meeting_data: {
        acad_year: string;
        meeting_id: number;
        acad_session: string;
        meeting_date: string;
        program_name: string;
        subject_name: string;
    }[];
    points: {
        id: number;
        point: string;
        subPoint: string;
        campus_lid: number;
        campus_name: string;
        type: string;
        text: string
    }[];
    header: FormAHeader[];
}

export type GroupedFormADetail = {
    attendees: UserAndCampus[];
    absentees: UserAndCampus[];
    meeting_data: {
        acad_year: string;
        meeting_id: number;
        acad_session: string;
        meeting_date: string;
        program_name: string;
        subject_name: string;
    }[];
    points: {
        [key: string]: {
			campus_lid: number
			campus_name: string
			id: number
			point: string
			subPoint: string
			text: string
			type: string
            enabled_a: boolean
		}[];
    };
    header: FormAHeader[];
}

export type FormADetailResponse = {
    groupedJson: GroupedFormADetail
    json: FormADetail
}

type Meeting = {
    point_id: number;
    campus_id: string;
    campus_name: string;
    point: string;
    sub_point: string;
    subject_name: string;
    type: string;
    text: string;
};

type DynamicMeetingContainer = {
    [key: string]: Meeting[];
};

//Form-B ====>>>>

export type FormBData = {
    point_id: number;
    point: string;
    sub_point: string;
    subject_id: number;
    subject_name: string;
    text: string;
}

export type FormAForFormB = {
	id: number;
	meeting_name: string;
	meeting_date: string;
	acad_year: number;
	acad_session: string;
	program_name: string;
	subject_name: string;
	summary: string;
};

type GetFormBResponse = {
    formASummary: DynamicMeetingContainer,
    formBData: FormBData[],
    groupedData: GroupedFormBData
}

export type FormBList = {
    program_lid: number;
    program_name: string;
    acad_year: string;
    acad_session: string;
    session_lid: number;
    final_submit: boolean;
    subject_name: string;
    subject_lid : number;
};

export type formBDetails = {
    program_name: string;
    program_lid: number;
    acad_year: string;
    acad_session: string;
    session_lid: number;
    subject_name: string;
    subject_lid : number;
}

export type FormBType = {
	header: {
        id: number;
        name: string;
    }[];
    data: FormBData[];
}

type DataToGetForFormB = { 
    acadYear: string; 
    program: number; 
    acadSession: number; 
}

export type GroupedFormBData = {
    [key: string]: FormBData[]
}

export type SchoolListAnalytics = {
    organization_id: number;
    organization_abbr: string;
    organization_name: string;
    meeting_count: number;

}

export type absenteesChart = {
    username : string;
    absentees_count : number;
}