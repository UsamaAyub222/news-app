import "./App.css";
import React, { Component } from "react";
import Navbar from "./components/Navbar";
import News from "./components/News";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

export default class App extends Component {
  state = {
      progress: 0
    }
  
  setProgress = (progress) => {
    this.setState({ progress: progress });
  };
  render() {
    return (
      <>
        <Router>
          <Navbar />
          <LoadingBar height={3} color="#f11946" progress={this.state.progress} />
          <Routes>
            <Route exact path="/" element={<News setProgress={this.setProgress} key="entertainment" pageSize={9}
              category="entertainment" />} />
            <Route exact path="/general" element={<News setProgress={this.setProgress} key="general" pageSize={9}
              category="general" />} />
            <Route exact path="/business" element={<News setProgress={this.setProgress} key="business" pageSize={9}
              category="business" />} />
            <Route exact path="/sports" element={<News setProgress={this.setProgress} key="sports" pageSize={9}
              category="sports" />} />
            <Route exact path="/technology" element={<News setProgress={this.setProgress} key="technology"
              pageSize={9} category="technology" />} />
          </Routes>
        </Router>
      </>
    );
  }
}
