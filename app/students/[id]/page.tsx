'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getStudentById, addModuleToStudent, removeModuleFromStudent } from '../../../lib/services/student-service';
import { StudentRead, ModuleCreate } from '@/types/student';

export default function StudentDetailPage() {
    const { id } = useParams();
    const [student, setStudent] = useState<StudentRead | null>(null);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);
    const [newModule, setNewModule] = useState<ModuleCreate>({ name: '', code: '' });
    const [showAddModuleForm, setShowAddModuleForm] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    
    // Studentendaten bei Laden der Seite holen
    useEffect(() => {
        const fetchStudent = async () => {
            try {
                setLoading(true);
                if (id) {
                    const studentId = parseInt(id as string);
                    if (isNaN(studentId)) {
                        throw new Error('Ungültige Studenten-ID');
                    }
                    const data = await getStudentById(studentId);
                    setStudent(data);
                }
            } catch (error: any) {
                setApiError('Fehler beim Laden des Studenten');
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id]);

    // Form-Fehler nach 3 Sekunden automatisch ausblenden
    useEffect(() => {
        if (formError) {
            const timer = setTimeout(() => {
                setFormError(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [formError]);

    if (loading) {
        return <div className="max-w-2xl mx-auto p-6">Laden...</div>;
    }

    if (apiError || !student) {
        return <div className="max-w-2xl mx-auto p-6 text-red-500">{apiError || 'Student nicht gefunden'}</div>;
    }

     // Funktion zum Hinzufügen eines Moduls
    const handleAddModule = async () => {
        try {
            setFormError(null);
            setApiError(null);
            if (student.id) {
                // Prüfung auf doppelte Modul-Codes oder -Namen
                if (student.modules && student.modules.some(module => module.code === newModule.code.trim())) {
                    setFormError('Ein Modul mit diesem Code existiert bereits.');
                    return;
                }
                if (student.modules && student.modules.some(module => module.name === newModule.name.trim())) {
                    setFormError('Ein Modul mit diesem Name existiert bereits.');
                    return;
                }

                // Modul hinzufügen
                await addModuleToStudent(student.id, newModule);
                setNewModule({ name: '', code: '' });
                setShowAddModuleForm(false);

                // Daten nach dem Hinzufügen neu laden
                const updatedStudent = await getStudentById(student.id);
                setStudent(updatedStudent);
            }
        } catch (error: any) {
            setApiError('Fehler beim Hinzufügen des Moduls');
        }
    };

    // Funktion zum Entfernen eines Moduls
    const handleRemoveModule = async (moduleIndex: number) => {
        try {
            setApiError(null);
            if (!student || !student.id) {
                throw new Error('Studentendaten nicht verfügbar');
            }
            if (!student.modules || !student.modules[moduleIndex]) {
                throw new Error('Modul nicht gefunden');
            }
            const moduleId = student.modules[moduleIndex].id;
            await removeModuleFromStudent(student.id, moduleId);

            // Daten nach dem Entfernen neu laden
            const updatedStudent = await getStudentById(student.id);
            setStudent(updatedStudent);
        } catch (error: any) {
            setApiError(`Fehler beim Entfernen des Moduls: ${error.message}`);
            console.error('Removal error:', error); 
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Studentendaten</h1>

             {/* Allgemeine Informationen */}
            <div className="mb-6">
                <p><strong>Vorname:</strong> {student.first_name}</p>
                <p><strong>Nachname:</strong> {student.last_name}</p>
                <p><strong>Matrikelnummer:</strong> {student.matriculation_number}</p>
            </div>

            {/* Modul-Liste */}
            <div className="mb-6">
                <h2 className="text-lg font-bold mb-2">Module</h2>
                {student.modules && student.modules.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {student.modules.map((module, index) => (
                            <li key={index} className="mb-2">
                                {`${module.code}: ${module.name}`}
                                <button
                                    onClick={() => handleRemoveModule(index)}
                                    className="ml-4 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                >
                                    Entfernen
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Keine Module vorhanden.</p>
                )}
            </div>

            {/* Button zum Anzeigen des Formulars */}
            <div>
                {!showAddModuleForm && (
                    <button
                        onClick={() => setShowAddModuleForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        + Modul hinzufügen
                    </button>
                )}

                {/* Formular zum Hinzufügen eines Moduls */}
                {showAddModuleForm && (
                    <div className="p-4 border rounded mt-4">
                        <h2 className="text-lg font-medium mb-4">Neues Modul hinzufügen</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="code" className="block text-sm font-medium text-black">
                                    Modulcode
                                </label>
                                <input
                                    id="code"
                                    name="code"
                                    value={newModule.code}
                                    onChange={(e) => setNewModule((prev) => ({ ...prev, code: e.target.value }))}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                                />
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-black">
                                    Modulname
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    value={newModule.name}
                                    onChange={(e) => setNewModule((prev) => ({ ...prev, name: e.target.value }))}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                                />
                            </div>
                            {/* Fehleranzeige im Formular */}
                            {formError && <div className="text-red-500 text-sm">{formError}</div>}
                            
                            <div className="space-x-4">
                                <button
                                    onClick={handleAddModule}
                                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Modul hinzufügen
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAddModuleForm(false);
                                        setNewModule({ name: '', code: '' }); 
                                        setFormError(null); 
                                    }}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                                >
                                    Abbrechen
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* Allgemeiner API-Fehler */}
            {apiError && <div className="text-red-500 mt-4">{apiError}</div>}
        </div>
    );
}