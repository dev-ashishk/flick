import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import MovieCard from "./../components/MovieList/Card";
import {fetchTopRatedMovies,fetchTrendingMovies, getLatestMovies} from "./../actions/api";
import Nav from "./../components/Nav";

const typeToHeadingMap = {
    top_rated: "Top Rated Movies",
    trending: "Trending Movies",
    latest: "Latest Movies",
}
class MovieList extends Component {
    state = {
        page : 1,
    }
    getDataByType = (type) => {
        switch(type){
            case "top_rated":
                this.props.fetchTopRatedMovies(this.state.page);
                this.setState({
                    page : this.state.page+1
                });
                return ;
                
            case "trending":
                this.props.fetchTrendingMovies(this.state.page);
                this.setState({
                    page : this.state.page+1
                });
                return;
                
            case "latest":
                this.props.getLatestMovies(this.state.page);
                this.setState({
                    page : this.state.page+1
                });
                return;
            default:
                return;
        }
    }
    componentDidMount = () => {
        window.addEventListener("scroll", this.handleScroll);
        const {movies, match} = this.props;
        const type = match.path.replace("/", "");
        const list = movies[type].list;
        if(list.length == 0){
            this.getDataByType(type);
        }
    }
    componentWillUnmount = () => {
        window.removeEventListener("scroll", this.handleScroll);
    }
    handleScroll = () => {
        const windowHeight = "innerHeight" in window
            ? window.innerHeight
            : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight) {
            const {match} = this.props;
            const type = match.path.replace("/","");
            this.getDataByType(type);
        }
    }
    render() {
        const {movies, match} = this.props;
        const key = match.path.replace("/", "");
        const list = movies[key].list;
        return (
            <div className="container">
                <p>{typeToHeadingMap[key] || ""}</p>
                <div ref={"movie-list-container"}>
                    {list.map((movie, i) => {
                        return (<MovieCard
                            movie={movie}
                            id={movie.id}
                            src={movie.poster_path}
                            title={movie.original_title}
                            rating={movie.vote_average}
                            date={movie.release_date}
                            key={i}/>)
                    })
}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({movies: state.app.movies});
export default withRouter(connect(mapStateToProps, {
    fetchTopRatedMovies,
    fetchTrendingMovies,
    getLatestMovies
})(MovieList));