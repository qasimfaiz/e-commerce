import React from "react";

import slider1 from "../assets/slider1.jpg";
import slider2 from "../assets/slider2.jpg";
import slider3 from "../assets/slider1.jpg"; // Using the same image as a placeholder
import slider4 from "../assets/slider2.jpg"; // Using the same image as a placeholder

function Hero() {
  return (
    <div>
      <div
        id="carouselExampleCaptions"
        className="carousel slide"
        data-mdb-ride="carousel"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-mdb-target="#carouselExampleCaptions"
            data-mdb-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-mdb-target="#carouselExampleCaptions"
            data-mdb-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-mdb-target="#carouselExampleCaptions"
            data-mdb-slide-to="2"
            aria-label="Slide 3"
          ></button>
          <button
            type="button"
            data-mdb-target="#carouselExampleCaptions"
            data-mdb-slide-to="3"
            aria-label="Slide 4"
          ></button>
        </div>
        <div className="carousel-inner mt-3">
          <div className="carousel-item active">
            <div className="container slider-custom">
              <img src={slider1} className="d-block w-100" alt="Slide 1" style={{ objectFit: "contain", height: "100%", width: "100%" }} />
            </div>
          </div>
          <div className="carousel-item">
            <div className="container slider-custom">
              <img src={slider2} className="d-block w-100" alt="Slide 2" style={{ objectFit: "contain", height: "100%", width: "100%" }} />
            </div>
          </div>
          <div className="carousel-item">
            <div className="container slider-custom">
              <img src={slider3} className="d-block w-100" alt="Slide 3" style={{ objectFit: "contain", height: "100%", width: "100%" }} />
            </div>
          </div>
          <div className="carousel-item">
            <div className="container slider-custom">
              <img src={slider4} className="d-block w-100" alt="Slide 4" style={{ objectFit: "contain", height: "100%", width: "100%" }} />
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-mdb-target="#carouselExampleCaptions"
          data-mdb-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" style={{ color: "black" }}></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-mdb-target="#carouselExampleCaptions"
          data-mdb-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true" style={{ color: "black" }}></span>
        </button>
      </div>
    </div>
  );
}

export default Hero;
