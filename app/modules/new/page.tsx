'use client';

import { useState } from 'react';
import { addModuleToStudent } from '../../../lib/services/student-service';
import { ModuleCreate } from '@/types/student';

export default function NewModulePage() {
    const [formData, setFormData] = useState<ModuleCreate>({
        code: '',
        name: '',
    });
    const [studentId, setStudentId] = useState<string>('');
    const [apiError, setApiError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    //Umgang mit Eingabeänderungen für Moduledaten
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value} = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    //Umgang mit Eingabeänderungen für studentId
    const handleStudentIdInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (/^\d*$/.test(value)) {
            setStudentId(value);
        }
    };

    //Form authentifizieren
    const validateForm = () => {
        if (!studentId || parseInt(studentId) <= 0 || isNaN(parseInt(studentId))) {
            return 'Ungültig Studenten-ID';
        }
        if (formData.code === '' || formData.name === '') {
            return 'Ungültig'
        }
        return null;
    };

    //Formular absenden
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const error = validateForm();
        if (error) {
            setApiError(error);
            return;
        }

        try {
            setApiError(null);
            setSuccessMessage(null);
            await addModuleToStudent(parseInt(studentId), formData);
            setSuccessMessage('Modul erfolgreich hinzugefügt');
            setFormData({ code: '', name: '' });
            setStudentId('');
        } catch (error: any) {
            setApiError(error.message);
        }
    }


    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Neues Modul hinzufügen</h1>
            {apiError && <div className="text-red-500 mb-4">{apiError}</div>}
            {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Student ID */}
                <div>
                    <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">
                        Studenten-ID
                    </label>
                    <input
                        id="student_id"
                        type="text"
                        value={studentId}
                        onChange={handleStudentIdInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder='z.B. 10'
                    />
                </div>

                {/* Module Code */}
                <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                        Modulcode
                    </label>
                    <input
                        id="code"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Module Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Modulname
                    </label>
                    <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Modul hinzufügen
                    </button>
                </div>
            </form>
        </div>
    );
};