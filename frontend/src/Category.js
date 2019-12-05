import React from "react";
import "./App.css";
class Category extends React.Component {
  render() {
    return (
      <div
        onClick={e => this.props.onClick(this.props.id)}
        className={"category item" + (this.props.isActive ? " active" : "")}
      >
        {this.props.name}
      </div>
    );
  }
}

export default Category;
