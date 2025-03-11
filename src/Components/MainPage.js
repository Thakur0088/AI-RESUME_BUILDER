import React, { useRef, useState } from "react";
import "./MainPage.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from "react-router-dom";
import resume1 from "../Images/resume1.png";
import resume2 from "../Images/resume2.png";
import resume3 from "../Images/resume3.png";
import resume4 from "../Images/resume4.png";
import resume5 from "../Images/resume5.png";
import resume6 from "../Images/resume6.png";
import resume7 from "../Images/resume7.png";
import resume8 from "../Images/resume8.avif";
import resume9 from "../Images/resume9.avif";
import resume10 from "../Images/resume10.avif";
import booking from "../Images/booking.svg";
import apple from "../Images/apple.svg";
import amazon from "../Images/amazon.svg";
import dhl from "../Images/dhl.svg";
import american from "../Images/american.svg";
import kpmg from "../Images/kpmg.svg";
import acc from "../Images/accenture.svg";
import cartoon from "../Images/cartoon.svg";
import swordIcon from "../Images/sword.svg";
import magicIcon from "../Images/magicicon.svg";
import templateIcon from "../Images/templateicon.svg";
import resumeExample1 from "../Images/resume-example1.png";
import resumeExample2 from "../Images/resume-example2.png";
import editVideo from "../Images/edit-customize_video.mp4";
import pregenerated from "../Images/pre-generated_video.mp4";


const MainPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const fileInputRef = React.useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", selectedFile);

    setUploading(true);
    setEvaluation(null);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error("Failed to upload");
      }

      const result = await response.json();
      console.log("Evaluation result:", result); // Log the result for debugging

      // Log detailed response for debugging
      console.log("Detailed response:", JSON.stringify(result, null, 2));

      // Ensure result contains score and feedback
      const evaluationResult = {
        score: result.score || 0,
        feedback: result.feedback || 'No feedback available',
      };

      setEvaluation(evaluationResult);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };


  const containerRef = useRef(null);
  const reviews = [
    {
      rating: 5,
      title: "Extremely Valuable Service",
      text: "Easily customizable CV, plenty of templates, and personalized assistance. Totally recommend!",
      author: "Christina Rose",
      time: "18 hours ago",
    },
    {
      rating: 5,
      title: "Easy to use",
      text: "Using this resume builder helped me create my CV in minutes. Give it a try!",
      author: "Lucía Moar",
      time: "19 hours ago",
    },
    {
      rating: 5,
      title: "resume.com is easy to use",
      text: "It is very intuitive & the series provided are so helpful!",
      author: "Erin Badger",
      time: "1 day ago",
    },
    {
      rating: 4,
      title: "Great experience",
      text: "Had a smooth experience with the resume builder. The templates are professional and well-designed.",
      author: "James Carter",
      time: "2 days ago",
    },
    {
      rating: 5,
      title: "Time-saver",
      text: "Saved me a lot of time building a professional resume. Highly recommended!",
      author: "Emma Watson",
      time: "2 days ago",
    },
    {
      rating: 4,
      title: "Helpful support",
      text: "Customer support was quick to respond and extremely helpful with my queries.",
      author: "Michael Jordan",
      time: "3 days ago",
    },
    {
      rating: 5,
      title: "User-friendly interface",
      text: "The interface is simple and easy to navigate. Perfect for beginners.",
      author: "Ava Brown",
      time: "3 days ago",
    },
    {
      rating: 5,
      title: "Worth every penny",
      text: "This resume builder is definitely worth the subscription. Great features!",
      author: "Noah Smith",
      time: "4 days ago",
    },
    {
      rating: 4,
      title: "Good but can improve",
      text: "Templates are great, but I'd love to see more design customization options.",
      author: "Liam Wilson",
      time: "4 days ago",
    },
    {
      rating: 5,
      title: "Perfect for job seekers",
      text: "Helped me land more interviews. The AI suggestions are on point!",
      author: "Sophia Lee",
      time: "5 days ago",
    },
    {
      rating: 5,
      title: "Highly recommended",
      text: "I've recommended this builder to all my friends. It's just amazing!",
      author: "Isabella Jones",
      time: "6 days ago",
    },
    {
      rating: 5,
      title: "Excellent features",
      text: "Auto-generated summaries and AI suggestions made resume writing so easy.",
      author: "Oliver Brown",
      time: "1 week ago",
    },
  ];




  // Scroll the container left or right by 300px
  const scrollLeft = () => {
    containerRef.current.scrollLeft -= 300;
  };

  const scrollRight = () => {
    containerRef.current.scrollLeft += 300;
  };

  return (
    <div className="container">
      <nav className="navbar">
        <div className="nav-icons">
          <p className="webname">
            <span className="large-text">resume.com</span>
            <span className="small-text">by smoother</span>
          </p>
          <a href="">Resume Template</a>
          <a href="">Resume Example</a>
          <a href="">Cover Letter</a>
          <a href="">Resources</a>
          <div className="navicon2">
            <Link to="/signin">My Account</Link>
            <a href=""><button className="resumebtn">Build my resume</button></a>
          </div>
        </div>
      </nav>
      <div className="mainpage">
        <div className="leftsection">
          <h1>The Ultimate Resume Builder</h1>
          <p className="aboutpara">Build beautiful, recruiter-tested resumes in a few clicks! Our resume builder is powerful and easy to use, with a range of amazing functions. Custom-tailor resumes for any job within minutes. Increase your interview chances and rise above the competition.</p>
          <button className="createmyresume">Create My Resume</button>
        </div>
        <div className="rightsection">
          <div className="templates">
            <div className="template-container">
              <img src={resume1} className="template" alt="Resume Template 1" />
              <img src={resume2} className="template" alt="Resume Template 2" />
              <img src={resume3} className="template" alt="Resume Template 3" />
              <img src={resume4} className="template" alt="Resume Template 4" />
              <img src={resume5} className="template" alt="Resume Template 5" />
              <img src={resume6} className="template" alt="Resume Template 6" />
              <img src={resume7} className="template" alt="Resume Template 7" />
              <img src={resume8} className="template" alt="Resume Template 8" />
              <img src={resume9} className="template" alt="Resume Template 9" />
              <img src={resume10} className="template" alt="Resume Template 10" />
            </div>
          </div>
        </div>
      </div>
      <div className="hiring-section above-background">
        <h2>Our candidates have been hired at:</h2>
        <div className="company-logos">
          <img src={booking} alt="Booking.com" />
          <img src={apple} alt="Apple" />
          <img src={amazon} alt="DHL" />
          <img src={dhl} alt="Amazon" />
          <img src={acc} alt="American Express" />
          <img src={american} alt="Accenture" />
          <img src={kpmg} alt="KPMG" />
        </div>
      </div>

      {/* Resume Info Section Below Hiring */}
      <div className="resume-info-section">
        <div className="resume-info-content">
          <img src={cartoon} alt="Resume Illustration" className="resume-illustration" />
          <div className="resume-info-text">
            <h2>Create a resume to land your next job</h2>
            <p>
              We have developed a <a href="#">resume builder</a> based on feedback from thousands of users, recruiter expertise, stellar template design, and the best hiring practices.
              The goal is simple: help you land that dream job interview! Get an advantage in the modern professional environment.
            </p>
            <button className="build-resume-btn">Build Your Resume</button>
          </div>
        </div>
      </div>
      <div className="features-section">
        <div className="feature">
          <img src={swordIcon} alt="Powerful Features" className="feature-icon" />
          <h3>Powerful and easy-to-use</h3>
          <p>
            Created to be suitable for all levels of job seekers. Our host of powerful features ranges
            from an excellent spell-checker to job tracking, multi-format export, auto-generated summaries,
            and more.
          </p>
        </div>
        <div className="feature">
          <img src={magicIcon} alt="Customization" className="feature-icon" />
          <h3>Customization made simple</h3>
          <p>
            Fine-tune your resume for a specific job with ease. We help you turn a generic document into a
            cutting-edge instrument that wins interviews. Transform universal resumes into perfect sales
            pitches with a few keystrokes.
          </p>
        </div>
        <div className="feature">
          <img src={templateIcon} alt="Expert Templates" className="feature-icon" />
          <h3>Templates designed by experts</h3>
          <p>
            Our <a href="#">designed templates</a> and <a href="#">examples</a> are reviewed by recruiters.
            This gives you a powerful boost in resume creation, straight from the other side of the job
            market – the people responsible for hiring and candidate evaluation.
          </p>
        </div>
      </div>

      {/* Proven Resume Templates Section */}
      <div className="resume-templates-section">
        <div className="resume-templates-content">
          <h2>Proven Resume Templates</h2>
          <p>The resume templates included in our resume builder have been approved by seasoned recruiters. Capturing the recruiters’ attention is the first step towards getting hired.</p>

          {/* Star Rating Section */}
          <div className="star-rating">
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="half-star">★</span>
            <div className="rating-text">
              <strong>4.5 out of 5</strong><br />
              based on 53,335 reviews on <a href="#" className="trustpilot-link">Trustpilot</a>
            </div>
          </div>

          <button className="select-template-btn">Select Template</button>
        </div>
        <div className="resume-carousel">
          <img src={resumeExample1} alt="Resume Example 1" className="resume-example" />
          <img src={resumeExample2} alt="Resume Example 2" className="resume-example" />
        </div>
      </div>

      <div className="customer-love-section">
        <img src="https://cdn-icons-png.flaticon.com/512/929/929566.png" alt="Love Icon" className="love-icon" />
        <h2>Why our customers love our resume builder</h2>
        <p>
          Our online resume builder tool and collection of elegant, recruiter-tested templates
          are used by more than 10 million people around the globe! We are incredibly proud to
          empower so many active professionals.
        </p>
        <button className="cta-button">Get started now</button>
      </div>

      <div className="edit-customize-section">
        {/* Left Side Content */}
        <div className="edit-customize-content">
          <h2>✏️ Edit and customize online</h2>
          <p>
            Customize resumes in a few clicks with no additional software.
            Cloud and offline syncing save your changes (even if you lose your internet connection)
            and allow you to stay creative and organized. A host of functions provide you with
            additional options and safety. Data protection, a great interface, and other features
            make resume creation a breeze!
          </p>
        </div>

        {/* Right Side Video */}
        <div className="edit-customize-video">
          <video className="edit-video" autoPlay muted loop playsInline>
            <source src={editVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Pre-Generated Resume Content Section */}
      <div className="pre-generated-resume">
        {/* Video Section */}
        <div className="resume-illustration">
          <video autoPlay loop muted>
            <source src={pregenerated} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Text Section */}
        <div className="resume-text">
          <h2>🚀 Pre-generated resume content</h2>
          <p>
            Make your life easier with automatic summary generation, AI pre-written phrases, optimized{" "}
            <span className="highlight">resume formatting</span> and beautiful visuals.
            With the support of our experts and automated tools, you can forget about writer’s block in resume writing.
            Streamline the process with our AI-powered resume builder as your trusted helper!
          </p>
        </div>
      </div>
      {/* Reviews Section */}
      <div className="reviews-section">
        <h2 className="reviews-title">
          Reviewed by the community. Trusted by professionals
        </h2>

        {/* Scroll Buttons */}
        <div className="reviews-controls">
          <button className="scroll-btn" onClick={scrollLeft}>
            &lt;
          </button>
          <button className="scroll-btn" onClick={scrollRight}>
            &gt;
          </button>
        </div>

        {/* Scrollable Reviews Container */}
        <div className="reviews-container" ref={containerRef}>
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              {/* Star Rating */}
              <p className="rating">{"⭐".repeat(review.rating)}</p>

              {/* Title */}
              <h3>{review.title}</h3>

              {/* Review Text */}
              <p>{review.text}</p>

              {/* Author and Time */}
              <span className="review-author">
                {review.author} • {review.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* New Section: Score Your Resume */}
      <section className="resume-score-section">
        <div className="container">
          <div className="text-content">
            <h2>Score Your Resume</h2>
            <p>
              Upload your resume and get an AI-powered evaluation to improve your job prospects.
              Our system provides insights on how well your resume aligns with industry standards.
            </p>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="file-input"
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <button onClick={handleUploadClick} className="upload-pdf-button">Upload PDF</button>
            {selectedFile && <p className="file-name">Uploaded: {selectedFile.name}</p>}
            <button onClick={handleUpload} disabled={uploading} className="upload-button">
              {uploading ? "Uploading..." : "Evaluate Resume"}
            </button>
            {evaluation && (
              <div className="evaluation-result">
                <h3>AI Evaluation Results</h3>
                <p>Score: {evaluation.score}/100</p>
                <p>Feedback: {evaluation.feedback}</p>
              </div>
            )}
          </div>
        </div>
      </section>


      {/* Footer Section */}
      <footer className="footer-section">
        <div className="footer-top">
          {/* Left: Social Media */}
          <div className="footer-socials">
            <h4>Connect with us on social media</h4>
            <div className="social-icons">
              {/* Replace # with your social media links */}
              <a href="#" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" aria-label="Pinterest">
                <i className="fab fa-pinterest"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" aria-label="Podcast">
                <i className="fas fa-podcast"></i>
              </a>
            </div>
          </div>

          {/* Right: Footer Columns */}
          <div className="footer-columns">
            {/* Column 1: Job Seekers */}
            <div className="footer-column">
              <h5>Job Seekers</h5>
              <ul>
                <li><a href="#">Create a resume</a></li>
                <li><a href="#">Resume templates</a></li>
                <li><a href="#">Cover Letter Templates</a></li>
                <li><a href="#">Job Search</a></li>
              </ul>
            </div>

            {/* Column 2: Career Resources */}
            <div className="footer-column">
              <h5>Career Resources</h5>
              <ul>
                <li><a href="#">Resume Help</a></li>
                <li><a href="#">Job Interview</a></li>
                <li><a href="#">Career</a></li>
                <li><a href="#">Cover Letter</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>

            {/* Column 3: Our Company */}
            <div className="footer-column">
              <h5>Our Company</h5>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Updates</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Sponsorship Program</a></li>
                <li><a href="#">Media Kit</a></li>
                <li><a href="#">Affiliates</a></li>
              </ul>
            </div>

            {/* Column 4: Support */}
            <div className="footer-column">
              <h5>Support</h5>
              <ul>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Right of Withdrawal</a></li>
                <li><a href="#">Do not sell, do not share</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-left">
            {/* Language Switcher */}
            <div className="footer-language">
              <img src="https://flagcdn.com/16x12/us.png" alt="US Flag" />
              <span>International</span>
            </div>
          </div>

          <div className="footer-right">
            <p>Copyright 2025 - resume.com</p>
            <p>
              More than a resume builder. resume.com is a part of the
              <strong> careerio</strong> product ecosystem.
            </p>
          </div>
        </div>
      </footer>




    </div>
  );

};

export default MainPage;
