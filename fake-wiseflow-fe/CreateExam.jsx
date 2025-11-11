import React, { useState } from "react";

export default function CreateExam() {
  // Local state til inputs
  const [form, setForm] = useState({
    name: "",
    date: "",
    description: "",
    type: "",
    examiner: "",
  });

  // Studerende
  const students = ["Nicklas", "Hadi", "Jonathan", "Florint"];

  // Håndter inputændringer
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Simulerer submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Exam oprettet:", form);
    alert("Eksamen oprettet! (se console)");
  };

  return (
    <div className="flex flex-col items-center w-full p-8">
      {/* Top banner */}
      <div className="bg-slate-500 text-white w-full text-center py-2 rounded-t-lg">
        Opret Eksamen
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-6 w-full max-w-4xl border border-gray-300 rounded-b-lg p-6 shadow-sm"
      >

        {/* Venstre side - inputs */}
        <div className="flex flex-col w-full md:w-2/3 gap-4">
          <input
            name="name"
            placeholder="Navn"
            className="border-b border-gray-400 focus:outline-none p-2"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="date"
            type="date"
            placeholder="Dato"
            className="border-b border-gray-400 focus:outline-none p-2"
            value={form.date}
            onChange={handleChange}
          />
          
          <textarea
            name="description"
            placeholder="Beskrivelse"
            rows="4"
            className="border border-gray-300 rounded p-2 focus:outline-none"
            value={form.description}
            onChange={handleChange}
          />

          {/* Type og eksaminator dropdowns */}
          <div className="flex gap-4 mt-2">
            <select
              name="type"
              className="border rounded p-2 flex-1"
              value={form.type}
              onChange={handleChange}
            >
              <option value="">Type</option>
              <option value="Mundtlig">Mundtlig</option>
              <option value="Skriftlig">Skriftlig</option>
            </select>

            <select
              name="examiner"
              className="border rounded p-2 flex-1"
              value={form.examiner}
              onChange={handleChange}
            >
              <option value="">Eksaminator</option>
              <option value="Navn">Navn</option>
              <option value="Navn">Navn</option>
              <option value="Navn">Navn</option>
            </select>
          </div>

          {/* Opret-knap */}
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded mt-4 w-fit"
          >
            Opret
          </button>
        </div>

        {/* Højre side - studerende */}
        <div className="w-full md:w-1/3 border border-gray-300 rounded p-4">
          <input
            type="text"
            placeholder="Søg efter studerende"
            className="border-b border-gray-400 w-full mb-2 focus:outline-none p-1"
          />
          <div className="mt-2">
            <strong>DMOE23</strong>
            <ul className="list-disc ml-5 mt-1 text-gray-700">
              {students.map((student, idx) => (
                <li key={idx}>{student}</li>
              ))}
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
}
