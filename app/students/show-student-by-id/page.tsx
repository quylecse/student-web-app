// app/students/show/page.tsx
'use client';

import { useState } from 'react';
import { getStudentById, getStudentModules } from '../../../lib/services/student-service';
import { StudentRead, ModuleRead } from '../../../types/student';

export default function ShowStudentByIdPage() {
    const [studentIdInput, setStudentIdInput] = useState<string>('');
    const [student, setStudent] = useState<StudentRead | null>(null);
    const [modules, setModules] = useState<ModuleRead[] | null>(null);
    const [isLoadingModules, setIsLoadingModules] = useState<boolean>(false);
    const [modulesError, setModulesError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStudentIdInput(event.target.value);
    };

    const handleSearch = async () => {
        if (!studentIdInput.trim()) {
            setError("Please enter a student ID.");
            setStudent(null);
            setModules(null);
            setModulesError(null);
            return;
        }

        const idAsNumber = parseInt(studentIdInput, 10);
        if (isNaN(idAsNumber)) {
            setError("Student ID must be a valid number.");
            setStudent(null);
            setModules(null);
            setModulesError(null);
            return;
        }

        setIsLoading(true);
        setError(null);
        setStudent(null);
        setModules(null);
        setModulesError(null);

        try {
            console.log(`[ShowStudentByIdPage] Searching for student with ID: ${idAsNumber}`);
            const fetchedStudent = await getStudentById(idAsNumber);
            setStudent(fetchedStudent);
            console.log(`[ShowStudentByIdPage] Student found:`, fetchedStudent);

            try {
                setIsLoadingModules(true);
                console.log(`[ShowStudentByIdPage] Fetching modules for student ID: ${idAsNumber}`);
                const fetchedModules = await getStudentModules(idAsNumber);
                setModules(fetchedModules);
                console.log(`[ShowStudentByIdPage] Modules found:`, fetchedModules);
            } catch (moduleErr: any) {
                const moduleErrorMessage = moduleErr.message || "Error loading student modules.";
                setModulesError(moduleErrorMessage);
                console.error(`[ShowStudentByIdPage] Error fetching modules:`, moduleErr);
            } finally {
                setIsLoadingModules(false);
            }

        } catch (err: any) {
            const errorMessage = err.message || "Error loading student data.";
            setError(errorMessage);
            console.error(`[ShowStudentByIdPage] Error:`, err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '700px', margin: '40px auto' }}>
            <h1 style={{ color: '#333', textAlign: 'center', marginBottom: '30px' }}>Search Student by ID</h1>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px', gap: '10px' }}>
                <input
                    type="text"
                    value={studentIdInput}
                    onChange={handleInputChange}
                    placeholder="Enter student ID"
                    style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px', width: '300px' }}
                />
                <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    style={{ padding: '12px 24px', fontSize: '16px', color: 'white', backgroundColor: isLoading ? '#aaa' : '#007bff', border: 'none', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
                >
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </div>

            {error && (
                <div style={{ color: 'red', border: '1px solid red', padding: '15px', borderRadius: '5px', backgroundColor: '#ffe6e6', marginTop: '20px', textAlign: 'center' }}>
                    <p><strong>Error:</strong> {error}</p>
                </div>
            )}

            {student && !error && (
                <div style={{ border: '1px solid #ddd', marginTop: '30px', padding: '25px', borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ margin: '0 0 20px', color: '#007bff', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Student Details</h2>
                    <p style={{ fontSize: '16px', margin: '8px 0' }}><strong>ID:</strong> {student.id}</p>
                    <p style={{ fontSize: '16px', margin: '8px 0' }}><strong>First Name:</strong> {student.first_name || 'N/A'}</p>
                    <p style={{ fontSize: '16px', margin: '8px 0' }}><strong>Last Name:</strong> {student.last_name || 'N/A'}</p>
                    <p style={{ fontSize: '16px', margin: '8px 0', marginBottom: '20px' }}><strong>Matriculation Number:</strong> {student.matriculation_number || 'N/A'}</p>

                    <h3 style={{ margin: '20px 0 10px', color: '#007bff', borderTop: '1px solid #eee', paddingTop: '20px' }}>Modules</h3>
                    {isLoadingModules && <p>Loading modules...</p>}
                    {modulesError && (
                        <div style={{ color: 'red', border: '1px solid red', padding: '10px', borderRadius: '5px', backgroundColor: '#ffe6e6', marginTop: '10px' }}>
                            <p><strong>Error loading modules:</strong> {modulesError}</p>
                        </div>
                    )}
                    {!isLoadingModules && !modulesError && modules && (
                        modules.length > 0 ? (
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                                {modules.map(module => (
                                    <li key={module.id} style={{ fontSize: '16px', margin: '5px 0' }}>
                                        ID: {module.id} <br />
                                        Code: {module.code} <br />
                                        Name: {module.name} <br />
                                        <br />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ fontSize: '16px', margin: '8px 0' }}>No modules assigned to this student.</p>
                        )
                    )}
                </div>
            )}
        </div>
    );
}
