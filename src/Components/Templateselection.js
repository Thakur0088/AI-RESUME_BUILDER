import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TemplateSelection.css";
import resume1 from "../Images/Tresume1.png";
import resume2 from "../Images/Tresume2.png";
import resume3 from "../Images/Tresume3.png";
import resume4 from "../Images/Tresume4.png";
import resume5 from "../Images/Tresume5.png";
import resume6 from "../Images/Tresume6.png";
import resume7 from "../Images/Tresume7.png";

const templates = [
  {
    id: 1,
    image: resume1,
    canvaLink:
      "https://www.canva.com/design/DAGkg3mushY/4VWgmvAvRGgT3NG9E4nTMQ/edit?utm_content=DAGkg3mushY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
  {
    id: 2,
    image: resume2,
    canvaLink:
      "https://www.canva.com/design/DAGkg_fNCb4/KTbKpN-mB7AilNO17Awj1g/edit?utm_content=DAGkg_fNCb4&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
  {
    id: 3,
    image: resume3,
    canvaLink:
      "https://www.canva.com/design/DAGkg2C3XxM/jMHjIvcSjG2kI_-viZzwww/edit?utm_content=DAGkg2C3XxM&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
  {
    id: 4,
    image: resume4,
    canvaLink:
      "https://www.canva.com/design/DAGkg38Mjwg/IaMfB15lmIUei88IfyhhJw/edit?utm_content=DAGkg38Mjwg&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
  {
    id: 5,
    image: resume5,
    canvaLink:
      "https://www.canva.com/templates/EAFD9-vWLY8-white-simple-resume/",
  },
  {
    id: 6,
    image: resume6,
    canvaLink:
      "https://www.canva.com/templates/EAGQUqfv6KQ-science-and-engineering-resume-in-green-black-simple-style/",
  },
  {
    id: 7,
    image: resume7,
    canvaLink:
      "https://www.canva.com/templates/EAGQUqfv6KQ-science-and-engineering-resume-in-green-black-simple-style/https://www.canva.com/templates/EAGPS-NVSqw-systems-design-resume-in-black-and-white-blue-bold-accent-style/",
  },
];

const TemplateSelection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleTemplateClick = (canvaLink) => {
    window.open(canvaLink, "_blank");
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? templates.length - 3 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === templates.length - 3 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="template-selection-container">
      {/* Progress Bar */}
      <div className="step-progress">
        <div className="step done">1</div>
        <div className="progress-line done"></div>
        <div className="step current">2</div>
        <div className="progress-line"></div>
        <div className="step">3</div>
      </div>

      <h2>Select Your Resume Template</h2>

      {/* Carousel */}
      <button className="carousel-arrow left" onClick={handlePrev}>
        &#8249;
      </button>
      <div
        className="carousel"
        style={{
          transform: `translateX(-${currentIndex * (100 / 3)}%)`,
        }}
      >
        {templates.map((template) => (
          <div
            key={template.id}
            className="template-card"
            onClick={() => handleTemplateClick(template.canvaLink)}
          >
            <img src={template.image} alt={`Template ${template.id}`} />
            <div className="template-title">Template {template.id}</div>
          </div>
        ))}
      </div>
      <button className="carousel-arrow right" onClick={handleNext}>
        &#8250;
      </button>
    </div>
  );
};

export default TemplateSelection;
