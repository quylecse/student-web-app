'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getStudentById, updateStudent } from '../../../../lib/services/student-service';
import { StudentUpdate } from '@/types/student';

export default function EditStudentPage() {
    const params = useParams(); // Get URL parameters
    const router = useRouter();
    const [formData, setFormData] = useState<StudentUpdate>({
        first_name: '',
        last_name: '',
        matriculation_number: '',
    });
    const [apiError, setApiError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const studentId = typeof params.id === 'string' ? parseInt(params.id) : NaN;

    // Fetch Studentdaten
    useEffect(() => {
        const fetchData = async () => {
            if (isNaN(studentId)) {
                setApiError('Ungültige Studenten-ID');
                setLoading(false);
                return;
            }

            try {
                const student = await getStudentById(studentId);
                setFormData({
                    first_name: student.first_name,
                    last_name: student.last_name,
                    matriculation_number: student.matriculation_number,
                });
            } catch (err: any) {
                setApiError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [studentId]);

    //Umgang mit Eingabeänderungen
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    //Form authentifizieren
    const validateForm = () => {
        if (formData.first_name === '' || formData.last_name === '' || formData.matriculation_number === '') {{
            return 'Alle Felder (Vorname, Nachname, Matrikelnummer) sind erforderlich';
        }
        return null;
        };
    }

    //Formular absenden
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const error = validateForm();
        if (error) {
            setApiError(apiError);
            return;
        }

        if (isNaN(studentId)) {
            setApiError('Ungültige Studenten-ID');
            return;
        }

        try {
            setApiError(null);
            setSuccess(null);
            await updateStudent(studentId, formData);
            setSuccess('Studentenprofil erfolgreich aktualisiert');
        } catch (err: any) {
            setApiError(err.message);
        }
    };

    if (loading) {
        return <div className="max-w-md mx-auto p-6">Lade Student...</div>;
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Studentenprofil bearbeiten</h1>
            {apiError && <div className="text-red-500 mb-4">{apiError}</div>}
            {success && <div className="text-green-500 mb-4">{success}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                        Vorname
                    </label>
                    <input
                        id="first_name"
                        name="first_name"
                        type="text"
                        //value={formData.first_name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                        Nachname
                    </label>
                    <input
                        id="last_name"
                        name="last_name"
                        type="text"
                        //value={formData.last_name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label htmlFor="matriculation_number" className="block text-sm font-medium text-gray-700">
                        Matrikelnummer
                    </label>
                    <input
                        id="matriculation_number"
                        name="matriculation_number"
                        type="text"
                        //value={formData.matriculation_number}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="z.B. 12345"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Studentenprofil aktualisieren
                    </button>
                </div>
            </form>
        </div>
    );
}