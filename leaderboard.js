"use strict";

// Row in the leaderboard table
var LeaderboardRow = React.createClass({
    displayName: "LeaderboardRow",

    render: function render() {
        return React.createElement("tr", null, React.createElement("td", null, this.props.number), React.createElement("td", null, React.createElement("img", {
            src: this.props.img,
            className: "img-circle table-img"
        }), this.props.username), React.createElement("td", {
            className: "text-center"
        }, this.props.recentPts), React.createElement("td", {
            className: "text-center"
        }, this.props.allTimePts));
    }
});

// Component holding the leaderboard
var Leaderboard = React.createClass({
    displayName: "Leaderboard",

    getInitialState: function getInitialState() {
        return {recent: null, allTime: null, sortBy: "recent"};
    },

    // Retrieve the leaderboard data once component mounts
    componentDidMount: function componentDidMount() {
        var _this = this;

        fetch("https://fcctop100.herokuapp.com/api/fccusers/top/recent").then(function(res) {
            return res.json();
        }).then(function(res) {
            return _this.setState({recent: res});
        });

        fetch("https://fcctop100.herokuapp.com/api/fccusers/top/alltime").then(function(res) {
            return res.json();
        }).then(function(res) {
            return _this.setState({allTime: res});
        });
    },

    // Sort the leaderboard based on user click
    onClick: function onClick(sort) {
        this.setState({sortBy: sort});
    },

    // Sort and build the leaderboard rows
    sortList: function sortList(leaderboardRows, sortBy) {
        if (this.state.sortBy == "recent") {
            this.state.recent.forEach(function(curr, index) {
                leaderboardRows.push(React.createElement(LeaderboardRow, {
                    number: index + 1,
                    img: curr.img,
                    username: curr.username,
                    recentPts: curr.recent,
                    allTimePts: curr.alltime
                }));
            });
        } else {
            this.state.allTime.forEach(function(curr, index) {
                leaderboardRows.push(React.createElement(LeaderboardRow, {
                    number: index + 1,
                    img: curr.img,
                    username: curr.username,
                    recentPts: curr.recent,
                    allTimePts: curr.alltime
                }));
            });
        }
    },

    render: function render() {
        var leaderboardRows = [];
        if (this.state.recent != null && this.state.allTime != null) {
            this.sortList(leaderboardRows, this.state.sortBy);
        }

        return React.createElement("tbody", null, React.createElement("tr", {
            className: "info"
        }, React.createElement("td", null, React.createElement("strong", null, "#")), React.createElement("td", null, React.createElement("strong", null, "Camper Name")), React.createElement("td", {
            className: "text-center",
            onClick: this.onClick.bind(this, "recent")
        }, React.createElement("strong", null, React.createElement("span", {
            className: this.state.sortBy == "recent"
                ? "glyphicon glyphicon-chevron-down"
                : ""
        }), " Points in last 30 days")), React.createElement("td", {
            className: "text-center",
            onClick: this.onClick.bind(this, "allTime")
        }, React.createElement("strong", null, React.createElement("span", {
            className: this.state.sortBy == "allTime"
                ? "glyphicon glyphicon-chevron-down"
                : ""
        }), " All time points"))), leaderboardRows);
    }
});

ReactDOM.render(React.createElement(Leaderboard, null), document.getElementById("leaderboard"));
