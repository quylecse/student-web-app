// types/student.d.ts

/**
 * Schnittstelle für ein Module-Objekt beim EMPFANG von der API (ModuleRead).
 * Basierend auf dem Schema ModuleRead und dem Item im Array 'modules' von StudentRead.
 */
export interface ModuleRead {
    id: number;     // Eindeutige ID des Moduls, Typ: Ganzzahl (integer)
    code: string;
    name: string;
}

/**
 * Schnittstelle für die zu SENDENDEN Daten zum ERSTELLEN eines neuen Moduls (ModuleCreate).
 * Basierend auf dem Schema ModuleCreate.
 */
export interface ModuleCreate {
    code: string;
    name: string;
}

/**
 * Schnittstelle für ein Studierendenobjekt beim EMPFANG von der API (StudentRead).
 * Dies ist die vollständige Struktur eines Studierenden inklusive ID und Modulen.
 */
export interface StudentRead {
    id: number;                 // ID des Studierenden (integer)
    first_name: string;
    last_name: string;
    matriculation_number: string;
    modules: ModuleRead[];
}

/**
 * Schnittstelle für die zu SENDENDEN Daten zum ERSTELLEN eines neuen Studierenden (StudentCreate).
 */
export interface StudentCreate {
    first_name: string;
    last_name: string;
    matriculation_number: string;
}

/**
 * Schnittstelle für die zu SENDENDEN Daten zum AKTUALISIEREN eines Studierenden (StudentUpdate).
 * Felder sind optional und können null sein, um partielle Updates zu ermöglichen.
 */
export interface StudentUpdate {
    first_name?: string | null;
    last_name?: string | null;
    matriculation_number?: string | null;
}

/**
 * Schnittstelle für Details eines Validierungsfehlers.
 * Dies ist die Struktur eines einzelnen Fehlers innerhalb des 'detail'-Arrays von HTTPValidationError.
 */
export interface ValidationErrorLoc {
    loc: (string | number)[];
    msg: string;
    type: string;
}

/**
 * Schnittstelle für das Objekt eines HTTP-Validierungsfehlers (HTTP-Status 422).
 * Enthält ein Array von ValidationErrorLoc.
 */
export interface HTTPValidationError {
    detail: ValidationErrorLoc[];
}
