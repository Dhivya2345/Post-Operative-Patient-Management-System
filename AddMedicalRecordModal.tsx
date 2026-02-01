import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { X, Upload } from "lucide-react";

type Props = {
  patientId: string;
  onClose: () => void;
};

export function AddMedicalRecordModal({ patientId, onClose }: Props) {
  // ✅ Correct placement of user extraction
  const { user } = useAuth();
  console.log("🧑‍⚕️ Current Supabase user:", user);

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    diagnosis: "",
    treatment_plan: "",
    medications: "",
    allergies: "",
    medical_history: "",
  });

  // ✅ Handle text input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  // ✅ Submit handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        alert("⚠️ You must be logged in to add a medical record.");
        setLoading(false);
        return;
      }

      const uploadedFiles: string[] = [];

      // Step A – Upload each selected image to Supabase Storage
      for (const file of files) {
        const filePath = `records/${patientId}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("patient_uploads")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Step B – Get the public URL for each uploaded file
        const { data: publicData } = supabase.storage
          .from("patient_uploads")
          .getPublicUrl(filePath);

        uploadedFiles.push(publicData.publicUrl);
      }

      // Step C – Save record to the database
      const { error } = await supabase.from("medical_records").insert({
        patient_id: patientId,
        ...formData,
        file_url: uploadedFiles, // stores public URLs
        created_by: user.id, // ✅ now properly defined
      });

      if (error) throw error;

      alert("✅ Medical record added successfully!");
      onClose();
    } catch (error: any) {
      console.error("❌ Error adding medical record:", error.message || error);
      alert("Failed to add medical record: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white flex items-center justify-between">
          <h2 className="text-2xl font-bold">Add Medical Record</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Diagnosis *
            </label>
            <input
              type="text"
              name="diagnosis"
              required
              value={formData.diagnosis}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter diagnosis"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Treatment Plan
            </label>
            <textarea
              name="treatment_plan"
              value={formData.treatment_plan}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Describe the treatment plan"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Medications
            </label>
            <textarea
              name="medications"
              value={formData.medications}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="List medications"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Allergies
            </label>
            <input
              type="text"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="List allergies"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Medical History
            </label>
            <textarea
              name="medical_history"
              value={formData.medical_history}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Previous medical history"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Scans / Reports
            </label>
            <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition-colors">
              <Upload className="w-6 h-6 text-blue-600 mr-2" />
              <span className="text-gray-600">
                Click to select images (PNG, JPG, JPEG)
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* ✅ View Selected Files Button */}
            {files.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  files.forEach((file) => {
                    const url = URL.createObjectURL(file);
                    window.open(url, "_blank");
                  })
                }
                className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                View Selected Files
              </button>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Record"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
