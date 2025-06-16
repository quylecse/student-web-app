'use client';

import { useState, useEffect } from 'react';
import { getStudents } from '../../lib/services/student-service';
import { StudentRead } from '@/types/student';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

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
        <div className={styles.studentDetailContainer}>
            <h1 className={styles.sectionHeading}>Studentenliste</h1>
            {students.length === 0 ? (
                <p className="text-gray-500">Keine Studenten vorhanden.</p>
            ) : (
                <table className={styles.table}>
                    <thead className={styles.tableHead}>
                        <tr>
                            <th>Name</th>
                            <th>Matrikelnummer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td className={styles.tableCellLink}>
                                    <Link href={`/students/${student.id}`} className={styles.navLink}>
                                        {`${student.first_name},  ${student.last_name}`}
                                    </Link>
                                </td>
                                <td className="text-black">{student.matriculation_number}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}