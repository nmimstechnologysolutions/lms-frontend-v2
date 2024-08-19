import { addToast } from '$lib/stores/toast-store';

interface FormData {
	is_parent: boolean;
	acad_year: string | undefined;
	campus_lid: number | undefined;
	program_lid: string | undefined;
	subject_lid: string | undefined;
	session_lid: string | undefined;
	meeting_date: string[];
	meeting_name: string | undefined;
	program_anchor: number[];
	course_anchor: number[];
	attendees: number[];
}

export const validateMasterForm = (data: FormData) => {
	// Validate acad_year
	if (!data.acad_year) {
		addToast({
			color: 'red',
			heading: 'Error',
			message: 'Academic year is required',
			position: 'bottom-right',
			error: true
		});

		return false;
	}

	// Validate program_lid
	if (!data.program_lid) {
		addToast({
			color: 'red',
			heading: 'Error',
			message: 'Program is required',
			position: 'bottom-right',
			error: true
		});

		return false;
	}

	// Validate subject_lid
	if (!data.subject_lid) {
		addToast({
			color: 'red',
			heading: 'Error',
			message: 'Subject is required',
			position: 'bottom-right',
			error: true
		});
        
		return false;
	}

	// Validate session_lid
	if (!data.session_lid) {
		addToast({
			color: 'red',
			heading: 'Error',
			message: 'Academic Session is required',
			position: 'bottom-right',
			error: true,
		});

        return false;
	}

    	// Validate program_anchor array
	if (!data.program_anchor || data.program_anchor.length === 0) {
		addToast({
			color: 'red',
			heading: 'Error',
			message: 'Program Anchor is required',
			position: 'bottom-right',
			error: true,
		});

        return false;
	}
    
	// Validate course_anchor array
	if (!data.course_anchor || data.course_anchor.length === 0) {
		addToast({
			color: 'red',
			heading: 'Error',
			message: 'Course Anchor is required',
			position: 'bottom-right',
			error: true,
		});

        return false
	}

	// Validate meeting_date array
	if (!data.meeting_date || data.meeting_date.length === 0) {
		addToast({
			color: 'red',
			heading: 'Error',
			message: 'Meeting Date is required',
			position: 'bottom-right',
			error: true,
		});

        return false;
	}

	// Validate meeting_name
	if (!data.meeting_name) {
		addToast({
			color: 'red',
			heading: 'Error',
			message: 'Meeting Name is required',
			position: 'bottom-right',
			error: true,
		});

        return false;
	}

	// Validate attendees array
	if (!data.attendees || data.attendees.length === 0) {
		addToast({
			color: 'red',
			heading: 'Error',
			message: 'Attendees is required',
			position: 'bottom-right',
			error: true,
		});

        return false
	}

	if(data.is_parent && !data.campus_lid) {
		addToast({
			color: 'red',
			heading: 'Error',
			message: 'Campus is required for parent!',
			position: 'bottom-right',
			error: true,
		});

        return false
	} 

	
    return true
};



export const validateMasterFormEdit = (data: FormData) => {
	
    	// Validate program_anchor array
	if (!data.program_anchor || data.program_anchor.length === 0) {
		addToast({
			color: 'red',
			heading: 'Error',
			message: 'Program Anchor is required',
			position: 'bottom-right',
			error: true,
		});

        return false;
	}
    
	// Validate course_anchor array
	if (!data.course_anchor || data.course_anchor.length === 0) {
		addToast({
			color: 'red',
			heading: 'Error',
			message: 'Course Anchor is required',
			position: 'bottom-right',
			error: true,
		});

        return false
	}

	// Validate meeting_date array
	if (!data.meeting_date || data.meeting_date.length === 0) {
		addToast({
			color: 'red',
			heading: 'Error',
			message: 'Meeting Date is required',
			position: 'bottom-right',
			error: true,
		});

        return false;
	}

	// Validate meeting_name
	if (!data.meeting_name) {
		addToast({
			color: 'red',
			heading: 'Error',
			message: 'Meeting Name is required',
			position: 'bottom-right',
			error: true,
		});

        return false;
	}

	// Validate attendees array
	if (!data.attendees || data.attendees.length === 0) {
		addToast({
			color: 'red',
			heading: 'Error',
			message: 'Attendees is required',
			position: 'bottom-right',
			error: true,
		});

        return false
	}

	
    return true
};
