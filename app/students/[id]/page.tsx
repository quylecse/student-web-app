'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getStudentById, addModuleToStudent } from '../../../lib/services/student-service';
import { StudentRead, ModuleCreate } from '@/types/student';

export default function StudentDetailPage() {
    const { id } = useParams();
    const [student, setStudent] = useState<StudentRead | null>(null);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);
    const [newModule, setNewModule] = useState<ModuleCreate>({ name: '', code: '' });
    const [showAddModuleForm, setShowAddModuleForm] = useState(false);
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

    if (loading) {
        return <div className="max-w-2xl mx-auto p-6">Laden...</div>;
    }

    if (apiError || !student) {
        return <div className="max-w-2xl mx-auto p-6 text-red-500">{apiError || 'Student nicht gefunden'}</div>;
    }

    // Handle adding a module
    const handleAddModule = async () => {
        try {
            setApiError(null);
            if (student.id) {
                await addModuleToStudent(student.id, newModule);
                setNewModule({ name: '', code: '' }); // Reset form
                const updatedStudent = await getStudentById(student.id);
                setStudent(updatedStudent); // Refresh student data
            }
        } catch (error: any) {
            setApiError('Fehler beim Hinzufügen des Moduls');
        }
    };

    // Handle removing a module (placeholder, requires API endpoint)
    const handleRemoveModule = async (moduleIndex: number) => {
        try {
            setApiError(null);
            if (student.id) {
                // Assuming a DELETE endpoint like /students/{studentId}/modules/{moduleIndex}
                const response = await fetch(`${process.env.API_BASE_URL}/students/${student.id}/modules/${moduleIndex}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to remove module');
                const updatedStudent = await getStudentById(student.id);
                setStudent(updatedStudent); // Refresh student data
            }
        } catch (error: any) {
            setApiError('Fehler beim Entfernen des Moduls');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Studentendaten</h1>
            <div className="mb-6">
                <p><strong>Vorname:</strong> {student.first_name}</p>
                <p><strong>Nachname:</strong> {student.last_name}</p>
                <p><strong>Matrikelnummer:</strong> {student.matriculation_number}</p>
            </div>
            <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">Module</h2>
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
            <div>
            {!showAddModuleForm && (
                    <button
                        onClick={() => setShowAddModuleForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        + Modul hinzufügen
                    </button>
                )}
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
                                    onChange={(e) => setNewModule({ ...newModule, code: e.target.value })}
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
                                    onChange={(e) => setNewModule({ ...newModule, name: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                                />
                            </div>
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
                                        setNewModule({ name: '', code: '' }); // Reset form
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
        </div>
    );
}