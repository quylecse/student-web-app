// lib/services/student-service.ts
import {
  StudentRead,
  StudentCreate,
  StudentUpdate,
  ModuleRead,
  ModuleCreate,
  HTTPValidationError,
  ValidationErrorLoc,
} from '../../types/student';

const API_BASE_URL = '/api';

// Hilfsfunktion zur Verarbeitung von API-Antworten
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 422) {
      const errorDetail: HTTPValidationError = await response.json();
      throw new Error(`Validation Error (${response.status}): ${JSON.stringify(errorDetail.detail)}`);
    }
    const errorBody = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`API Error (${response.status}): ${errorBody.message || 'Unknown error'}`);
  }
  return response.json();
}

// 1. GET /students (Liste aller Studierenden)
export async function getStudents(): Promise<StudentRead[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/students`);
    const data: StudentRead[] = await handleApiResponse(response);
    return data;
  } catch (error: any) {
    console.error('Fehler beim Abrufen der Studierenden:', error.message);
    throw error;
  }
}

// 2. POST /students (Neuen Studierenden erstellen)
export async function createStudent(studentData: StudentCreate): Promise<StudentRead> {
  try {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    const newStudent: StudentRead = await handleApiResponse(response);
    return newStudent;
  } catch (error: any) {
    console.error('Fehler beim Erstellen des Studierenden:', error.message);
    throw error;
  }
}

// 3. GET /students/{student_id} (Einen Studierenden abrufen)
export async function getStudentById(studentId: number): Promise<StudentRead> {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`);
    const student: StudentRead = await handleApiResponse(response);
    return student;
  } catch (error: any) {
    console.error(`Fehler beim Abrufen des Studierenden mit ID ${studentId}:`, error.message);
    throw error;
  }
}

// 4. PUT /students/{student_id} (Studierenden aktualisieren)
export async function updateStudent(studentId: number, studentData: StudentUpdate): Promise<StudentRead> {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    const updatedStudent: StudentRead = await handleApiResponse(response);
    return updatedStudent;
  } catch (error: any) {
    console.error(`Fehler beim Aktualisieren des Studierenden mit ID ${studentId}:`, error.message);
    throw error;
  }
}

// 5. DELETE /students/{student_id} (Studierenden löschen)
export async function deleteStudent(studentId: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      await handleApiResponse(response); // Wird Fehler auslösen, wenn response nicht ok ist
    }
    // Wenn alles ok ist und kein Body zurückgegeben wird, endet die Funktion einfach (void)
  } catch (error: any) {
    console.error(`Fehler beim Löschen des Studierenden mit ID ${studentId}:`, error.message);
    throw error;
  }
}

// 6. GET /students/{student_id}/modules (Module eines Studierenden auflisten)
export async function getStudentModules(studentId: number): Promise<ModuleRead[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}/modules`);
    const modules: ModuleRead[] = await handleApiResponse(response);
    return modules;
  } catch (error: any) {
    console.error(`Fehler beim Abrufen der Module für Studierenden ID ${studentId}:`, error.message);
    throw error;
  }
}

// 7. POST /students/{student_id}/modules (Modul einem Studierenden hinzufügen)
// Ein Modul zu einem Studierenden hinzufügen.
// Der Request Body ist vom Typ ModuleCreate.
export async function addModuleToStudent(studentId: number, moduleData: ModuleCreate): Promise<ModuleRead> {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}/modules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(moduleData), // <-- Wichtiger Teil: Daten als JSON senden
    });
    const addedModule: ModuleRead = await handleApiResponse(response);
    return addedModule;
  } catch (error: any) {
    console.error(`Fehler beim Hinzufügen des Moduls für Studierenden ID ${studentId}:`, error.message);
    throw error;
  }
}

// 8. DELETE /students/{student_id}/modules/{module_id} (Modul von Studierenden entfernen)
// Ein Modul von einem Studierenden entfernen.
export async function removeModuleFromStudent(studentId: number, moduleId: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}/modules/${moduleId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      await handleApiResponse(response); // Wird Fehler auslösen, wenn response nicht ok ist
    }
  } catch (error: any) {
    console.error(`Fehler beim Entfernen des Moduls ${moduleId} von Studierenden ${studentId}:`, error.message);
    throw error;
  }
}
