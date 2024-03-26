import React, { useState } from "react";
import { jsPDF } from "jspdf";

const CreatePDFWithTextBox: React.FC = () => {
  const [textboxes, setTextboxes] = useState<
    { id: string; text: string; x: number; y: number }[]
  >([]);
  const [formData, setFormData] = useState<{
    name: string;
    experience: string;
    education: string;
  }>({
    name: "",
    experience: "",
    education: "",
  });

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    id: string
  ) => {
    event.dataTransfer.setData("id", id);
    setIsDragging(true);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("id");
    const { clientX, clientY } = event;
    const pdfX = (clientX * 210) / window.innerWidth;
    const pdfY = (clientY * 297) / window.innerHeight;
    const updatedTextboxes = textboxes.map((textbox) =>
      textbox.id === id ? { ...textbox, x: pdfX, y: pdfY } : textbox
    );
    setTextboxes(updatedTextboxes);
    setIsDragging(false);
  };

  const downloadPdf = () => {
    const doc = new jsPDF("p", "mm", "a4");
    doc.setDrawColor(255, 255, 255);
    doc.setFillColor(255, 255, 255);
    doc.rect(
      0,
      0,
      doc.internal.pageSize.getWidth(),
      doc.internal.pageSize.getHeight(),
      "F"
    );
    textboxes.forEach((textbox) => {
      doc.text(textbox.text, textbox.x, textbox.y);
    });
    doc.save("example.pdf");
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.experience || !formData.education) {
      alert("Please fill in all fields.");
      return;
    }
  
    const idPrefix = `textbox-${textboxes.length + 1}`;
  
    const nameId = `${idPrefix}-name`;
    const experienceId = `${idPrefix}-experience`;
    const educationId = `${idPrefix}-education`;
  
    const nameY = 50 + textboxes.length * 20;
    const experienceY = nameY + 30;
    const educationY = experienceY + 30; // Adjusted from + 40 to + 30
  
    setTextboxes([
      ...textboxes,
      { id: nameId, text: formData.name, x: 50, y: nameY },
      { id: experienceId, text: formData.experience, x: 50, y: experienceY },
      { id: educationId, text: formData.education, x: 50, y: educationY },
    ]);
  };
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </label>
        <label>
          Experience:
          <input
            type="text"
            value={formData.experience}
            onChange={(e) =>
              setFormData({ ...formData, experience: e.target.value })
            }
          />
        </label>
        <label>
          Education:
          <input
            type="text"
            value={formData.education}
            onChange={(e) =>
              setFormData({ ...formData, education: e.target.value })
            }
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      <div
        style={{ width: "210mm", height: "297mm", backgroundColor: "#ffffff" }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {textboxes.map((textbox) => (
          <div
            key={textbox.id}
            draggable={!isDragging}
            onDragStart={(event) => handleDragStart(event, textbox.id)}
            style={{ position: "absolute", left: textbox.x, top: textbox.y }}
          >
            <input
              type="text"
              value={textbox.text}
              onChange={(e) => {
                const updatedTextboxes = textboxes.map((tb) =>
                  tb.id === textbox.id ? { ...tb, text: e.target.value } : tb
                );
                setTextboxes(updatedTextboxes);
              }}
            />
          </div>
        ))}
      </div>
      <button onClick={downloadPdf}>Download PDF</button>
    </div>
  );
};

export default CreatePDFWithTextBox;
