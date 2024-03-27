import React, { useState } from "react";
import { jsPDF } from "jspdf";
import Draggable from "react-draggable";

const App = () => {
  
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

    console.log("textboxes : ", textboxes)
    
    
    // TODO : To get x, y coordinates of the elements . To get the correct postion in the A4 sheet
    var position = document.getElementById('name').getBoundingClientRect();
    var name_x = position.left 
    var name_y = position.top 

    var position = document.getElementById('experience').getBoundingClientRect();
    var experience_x = position.left 
    var experience_y = position.top 

    var position = document.getElementById('education').getBoundingClientRect();
    var education_x = position.left 
    var education_y = position.top 

    console.log("x,y div id name", name_x ,name_y)

    textboxes.forEach((textbox) => {
      if (textbox.id.includes("name")) {
        doc.text(`Name: ${textbox.text}`, (name_x * 210) / window.innerWidth, (name_y * 297) / window.innerHeight);
      } else if (textbox.id.includes("experience")) {
        doc.text(`Experience: ${textbox.text}`, (experience_x * 210) / window.innerWidth, (experience_y * 297) / window.innerHeight);
      } else if (textbox.id.includes("education")) {
        doc.text(`Education: ${textbox.text}`,  (education_x * 210) / window.innerWidth, (education_y * 297) / window.innerHeight);
      }
    });

    doc.save("example.pdf");
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.experience || !formData.education) {
      alert("Please fill in all fields.");
      return;
    }



    const nameY = 50 + textboxes.length * 20;
    const experienceY = nameY + 30;
    const educationY = experienceY + 30; 

    setTextboxes([
      ...textboxes,
      { id: "name", text: formData.name, x: 50, y: nameY },
      { id: "experience", text: formData.experience, x: 50, y: experienceY },
      { id: "education", text: formData.education, x: 50, y: educationY },
    ]);
  };



  return (
    <div
      style={{ display: "flex", padding: ".5rem .5rem", borderRadius: "3rem" }}
    >
      <div
        id="paper"
        style={{ width: "210mm", height: "297mm", backgroundColor: "#ffffff" }}
        // onDragOver={handleDragOver}
        // onDrop={handleDrop}
      >
        {textboxes.map((textbox) => 
        (
          <Draggable>
          <div
            key={textbox.id}
            // draggable="true"
            // onDragStart={(event) => handleDragStart(event, textbox.id)}
            // onKeyDown={(event) => handleKeyDown(event, textbox.id)}
              tabIndex={0}
              
            style={{ position: "absolute", left: textbox.x, top: textbox.y }}
          >
            {textbox.id.includes("name") && (
              <div id="name" style={{ color: "black" }}>Name:</div>
            )}
            {textbox.id.includes("experience") && (
              <div id="experience" style={{ color: "black", marginTop: "20px" }}>
                Experience:
              </div>
            )}
            {textbox.id.includes("education") && (
              <div id="education" style={{ color: "black", marginTop: "40px" }}>
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
          </Draggable>
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
              className="bg-purple-800"
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
          <div>
            I can now be moved around! Git Branch Draggable
          </div>
        </Draggable>
      </div>
    </div>
  );
};

export default App;
