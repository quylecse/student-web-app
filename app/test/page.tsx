// app/test/page.tsx
// KEIN 'use client' hier, da dies standardmäßig eine Server Component ist

import { getStudents } from '../../lib/services/student-service'; // Nur die Funktion getStudents importieren
import { StudentRead } from '../../types/student'; // StudentRead direkt aus types/student importieren

export default async function TestPage() {
    let students: StudentRead[] = [];
    let error: string | null = null;

    try {
        // Aufruf der Service-Funktion getStudents() aus der Server Component
        // Diese Log-Ausgabe erscheint im TERMINAL (wo 'npm run dev' ausgeführt wird)
        console.log("[TestPage - Server Component] Alle Studenten werden über den Service geladen...");
        students = await getStudents();
        console.log("[TestPage - Server Component] Alle Studenten erfolgreich geladen.");
    } catch (err: any) {
        error = err.message || "Die Liste der Studenten konnte nicht geladen werden.";
        console.error("[TestPage - Server Component] Fehler beim Laden der Studenten:", err);
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ color: '#333' }}>Testseite (nur Server Component): Studentenliste</h1>
            <p>Dies ist deine Testseite, die Studentendaten über den Service anzeigt.</p>

            {error ? (
                <div style={{ color: 'red', border: '1px solid red', padding: '10px', borderRadius: '5px', backgroundColor: '#ffe6e6', marginTop: '20px' }}>
                    <p>Beim Laden der Daten ist ein Fehler aufgetreten:</p>
                    <p><em>{error}</em></p>
                    <p>Bitte überprüfe die Server-Konsole für weitere Details.</p>
                </div>
            ) : (
                students.length === 0 ? (
                    <p style={{ color: '#555', marginTop: '20px' }}>Es sind keine Studenten in der Liste.</p>
                ) : (
                    <ul style={{ listStyleType: 'none', padding: 0, marginTop: '20px' }}>
                        {students.map((student) => (
                            <li key={student.id} style={{
                                border: '1px solid #ddd',
                                margin: '10px 0',
                                padding: '15px',
                                borderRadius: '8px',
                                backgroundColor: '#f9f9f9',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                                <h3 style={{ margin: '0 0 10px', color: '#007bff' }}>
                                    {student.first_name} {student.last_name}
                                </h3>
                                <p style={{ margin: '5px 0', color: '#666' }}>
                                    <strong>ID:</strong> {student.id}
                                </p>
                                <p style={{ margin: '5px 0', color: '#666' }}>
                                    <strong>Vorname:</strong> {student.first_name}
                                </p>
                                <p style={{ margin: '5px 0', color: '#666' }}>
                                    <strong>Nachname:</strong> {student.last_name}
                                </p>
                                <p style={{ margin: '5px 0', color: '#666' }}>
                                    <strong>Matrikelnummer:</strong> {student.matriculation_number}
                                </p>
                            </li>
                        ))}
                    </ul>
                )
            )}
        </div>
    );
}
