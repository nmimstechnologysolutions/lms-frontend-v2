export type Alert = {
	color: 'red' | 'blue' | 'green' | 'yellow' | 'dark' | undefined;
	message: string | null;
	heading: string | null;
};

export type ToastType = {
	color: 'primary' | 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'orange' | 'none';
	message: string | null;
	heading: string | null;
	position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'none',
	error: boolean;
	errorId?: string;
};
