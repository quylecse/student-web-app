'use client';

import { useState, useEffect } from 'react';
import { getStudents } from '../../lib/services/student-service';
import { StudentRead } from '@/types/student';
import Link from 'next/link';

export default function StudentsPage() {
    const [students, setStudents] = useState<StudentRead[]>([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const data = await getStudents();
                setStudents(data);
            } catch (error: any) {
                setApiError('Fehler beim Laden der Studenten');
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    if (loading) {
        return <div className="max-w-2xl mx-auto p-6">Laden...</div>;
    }

    if (apiError) {
        return <div className="max-w-2xl mx-auto p-6 text-red-500">{apiError}</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Studentenliste</h1>
            {students.length === 0 ? (
                <p className="text-gray-500">Keine Studenten vorhanden.</p>
            ) : (
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-black">
                            <th className="border p-2 text-left">Name</th>
                            <th className="border p-2 text-left">Matrikelnummer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id} className="border-t">
                                <td className="border p-2">
                                    <Link href={`/students/${student.id}`} className="text-blue-600 hover:underline">
                                        {`${student.first_name} ${student.last_name}`}
                                    </Link>
                                </td>
                                <td className="border p-2">{student.matriculation_number}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}