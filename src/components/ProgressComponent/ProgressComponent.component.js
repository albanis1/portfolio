import React, { useState } from 'react';

const ProgressComponent = () => {
  const [currentStep, setCurrentStep] = useState(null);

  const steps = [
    "Technical Lead - PT DaNS Multi Pro",
    "Senior Fullstack Developer - PT DaNS Multi Pro",
    "Fullstack Developer - PT DaNS Multi Pro",
    "Freelance Software Developer"
  ];

  const years = [
    "2023",
    "2022",
    "2021",
    "2020 - 2019",
  ]

  const description = [
    `Design system architecture, Technical analysis, Cordinator Squad Developers, Fixing issues collaborated with the team`,
    "Develop web-based applications, application programming interface, scheduler, standin techlead",
    "Develop web-based applications, application programming interface, scheduler",
    "Create Application of Point of Sales at KunK Store & Many more.",
  ]

  const onHover = (index) => {
    setCurrentStep(index);
  };

  return (
    <div className="outer">
      <div className="progress">
        <div className="left">
          {[...Array(steps.length)].map((_, index) => (
            <div
              key={index}
              className={`${
                currentStep === index
                  ? "current"
                  : currentStep > index
                  ? "prev"
                  : ""
              }`}
              onMouseEnter={() => onHover(index)}
            >
              {years[index]}
            </div>
          ))}
        </div>
        <div className="right">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`${
                currentStep === index
                  ? "current"
                  : currentStep > index
                  ? "prev"
                  : ""
              }`}
              onMouseEnter={() => onHover(index)}
            >
              <h3 style={{marginTop: '0'}}>{step}</h3>
              <p> {description[index]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressComponent;
