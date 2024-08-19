import type { FacultyRole } from "$lib/types/mpc";
import { writable } from "svelte/store";

export const facultyRoleStore = writable<FacultyRole[]>([]);