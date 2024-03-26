import React, { useState } from "react";
import { jsPDF } from "jspdf";
import Draggable from "react-draggable"; // The default

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
      if (textbox.id.includes("-name")) {
        doc.text(`Name: ${textbox.text}`, textbox.x, textbox.y);
      } else if (textbox.id.includes("-experience")) {
        doc.text(`Experience: ${textbox.text}`, textbox.x, textbox.y);
      } else if (textbox.id.includes("-education")) {
        doc.text(`Education: ${textbox.text}`, textbox.x, textbox.y);
      }
    });

    // textboxes.forEach((textbox) => {
    //   doc.text(textbox.text, textbox.x, textbox.y);
    // });
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

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    id: string
  ) => {
    const moveAmount = 5; // Adjust this value for the desired movement speed
    const updatedTextboxes = textboxes.map((textbox) => {
      if (textbox.id === id) {
        let newX = textbox.x;
        let newY = textbox.y;
        switch (event.key) {
          case "ArrowUp":
            newY -= moveAmount;
            break;
          case "ArrowDown":
            newY += moveAmount;
            break;
          case "ArrowLeft":
            newX -= moveAmount;
            break;
          case "ArrowRight":
            newX += moveAmount;
            break;
          default:
            return textbox;
        }
        return { ...textbox, x: newX, y: newY };
      } else {
        return textbox;
      }
    });
    setTextboxes(updatedTextboxes);
  };

  return (
    <div
      style={{ display: "flex", padding: ".5rem .5rem", borderRadius: "3rem" }}
    >
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
            onKeyDown={(event) => handleKeyDown(event, textbox.id)}
            tabIndex={0}
            style={{ position: "absolute", left: textbox.x, top: textbox.y }}
          >
            {textbox.id.includes("-name") && (
              <div style={{ color: "black" }}>Name:</div>
            )}
            {textbox.id.includes("-experience") && (
              <div style={{ color: "black", marginTop: "20px" }}>
                Experience:
              </div>
            )}
            {textbox.id.includes("-education") && (
              <div style={{ color: "black", marginTop: "40px" }}>
                Education:
              </div>
            )}
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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          marginTop: "1rem",
          marginLeft: "2rem",
        }}
      >
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </label>
          <br />
          <br />
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
          <br />
          <br />
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
          <br />
          <br />
          <button type="submit">Submit</button>
        </form>
        <button onClick={downloadPdf}>Download PDF</button>

        <Draggable>
          <div style={{ color: "white" }}>I can now be moved around!</div>
        </Draggable>
      </div>
    </div>
  );
};

export default CreatePDFWithTextBox;
