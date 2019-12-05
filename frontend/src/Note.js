import React from "react";
import "./App.css";
import moment from "moment";
class Note extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      isRecent: false
    };
    this.recentTimer = null;
  }

  checkIsRecent() {
    const noteDate = moment(this.props.time, "DD/MM/YYYY HH:mm:ss");
    const fromNow = moment.duration(moment().diff(noteDate));
    if (fromNow.minutes() < 1) {
      this.setState({ isRecent: true });
      if (!this.recentTimer)
        this.recentTimer = setInterval(
          this.checkIsRecent.bind(this),
          10 * 1000
        );
    } else {
      this.setState({ isRecent: false });
      if (this.recentTimer) clearInterval(this.recentTimer);
    }
  }

  componentDidMount() {
    this.checkIsRecent();
  }

  render() {
    const date = moment(this.props.time, "DD/MM/YYYY HH:mm:ss").format(
      "DD/MM/YYYY HH:mm"
    );
    return (
      <div className={"notatka" + (this.state.isRecent ? " recent" : "")}>
        <div className="notatkaText">{this.props.text}</div>
        <div className="notatkaTime">{date}</div>
      </div>
    );
  }
}

export default Note;
